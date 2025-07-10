import useLocalization from "@/src/i18n/useLocalization";
import {
    ActivityIndicator,
    DimensionValue,
    FlatList,
    ListRenderItem,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {User} from "@/src/auth";
import {userService} from "@/src/api/services/userService";
import React, {useEffect, useState} from "react";
import {UserExperienceHistoryItem} from "@/src/types/userExperience";
import {PaginationMeta} from "@/src/types/pagination";
import Level1Icon from "@/components/svgs/levels/level1Icon";
import Level2Icon from "@/components/svgs/levels/level2Icon";
import Level3Icon from "@/components/svgs/levels/level3Icon";
import Level4Icon from "@/components/svgs/levels/level4Icon";
import Level5Icon from "@/components/svgs/levels/level5Icon";
import {LinearGradient} from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import brandColors from "@/assets/colors";
import ThemedModal from "@/components/forms/ThemedModal";

export default function ExperienceScreen() {
    const {i18n} = useLocalization();
    const [currentUser, setCurrentUser] = useState<User>()
    const [data, setData] = useState<UserExperienceHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false);
    const [progressPercent, setProgressPercent] = useState('0%');

    const fetchUser = () => {
        setIsLoading(true);

        userService.fetchUser()
            .then((response: User) => {
                setCurrentUser(response)
                let calculatedPercent = response.next_level_percentage
                setProgressPercent(calculatedPercent + '%');
                setIsLoading(false)
            })
    }

    const fetchData = (pageNumber: number) => {
        setIsLoading(true);
        userService.fetchExperience(pageNumber)
            .then((response) => {
                if (pageNumber === 1) {
                    setData(response.data);
                } else {
                    setData([...data, ...response.data]);
                }

                setPagination(response.meta);
                setIsLoading(false);
                !isFirstPageReceived && setIsFirstPageReceived(true);
            });
    };

    const fetchNextPage = () => {
        if (!pagination) {
            return null;
        }
        if (pagination.current_page === pagination.last_page) {
            return null;
        }
        fetchData(pagination.current_page + 1);
    };

    useEffect(() => {
        fetchUser();
        fetchData(1);
    }, []);

    const ListEndLoader = () => {
        if (!isFirstPageReceived && isLoading) {
            // Show loader at the end of list when fetching next page data.
            return <ActivityIndicator size={'large'}/>;
        }
    };

    if (!isFirstPageReceived && isLoading) {
        // Show loader when fetching first page data.
        return <ActivityIndicator size={'small'}/>;
    }

    const levelIcons = [
        (<Level1Icon width={40} height={40}/>),
        (<Level2Icon width={40} height={40}/>),
        (<Level3Icon width={40} height={40}/>),
        (<Level4Icon width={40} height={40}/>),
        (<Level5Icon width={40} height={40}/>),
    ];

    const gradients = [
        ['#EE0300', '#FE5900'],
        ['#FF5C00', '#FFC500'],
        ['#FFC801', '#D1DB01'],
        ['#D1DB00', '#02D063'],
    ];

    const level_up_colors = [
        {bg:'#EB2726', text: 'white'},
        {bg:'#F26F2D', text: 'white'},
        {bg:'#FFC807', text: 'black'},
        {bg:'#D1DB00', text: 'black'},
        {bg:'#00D163', text: 'white'},
    ];

    const renderItem: ListRenderItem<UserExperienceHistoryItem> = ({item}) => {
        if (item.type === 'level_up') {
            const levelUp = parseInt(item.reason)
            return (
                <View
                    style={{
                        backgroundColor: level_up_colors[levelUp-1].bg,
                    }}
                    className={'rounded-2xl p-4 mb-4'}
                >
                    <Text
                        style={{
                            color: level_up_colors[levelUp-1].text,
                        }}
                        className={'text-sm'}>{item.created_at.format('DD/MM/YYYY')}</Text>
                    <Text
                        style={{
                            color: level_up_colors[levelUp-1].text,
                        }}
                    >Assolit el nivell {levelUp}: {i18n.t(`experience_history.levels.${levelUp}`)}</Text>
                </View>
            )
        }
        return (
            <View className={'bg-white rounded-2xl p-4 mb-4'}>
                <Text className={'text-sm text-gray-500'}>{item.created_at.format('DD/MM/YYYY')}</Text>
                <Text>{item.points} {i18n.t('experience_history.points')} {item.reason}</Text>
            </View>
        );
    };

    const getHeader = () => {
        const [modalVisible, setModalVisible] = useState(false);

        if (!currentUser) {
            return <></>
        }

        return (
            <View className={'pt-4'}>
                <View>
                    <Text className={'font-bold text-2xl'}>{currentUser.name}</Text>
                    {currentUser.location && (
                        <Text>{currentUser.location}</Text>
                    )}
                </View>
                <View className="mt-4 gap-4 flex-row">
                    <View
                        className="grow bg-white py-4 rounded-2xl shrink-0 items-center justify-center"
                    >
                        {levelIcons[currentUser.level - 1]}
                        <Text
                            className="mt-2 font-bold text-xl">{i18n.t(`experience_history.levels.${currentUser.level}`)}</Text>
                    </View>
                    <View
                        className="grow bg-white py-4 rounded-2xl shrink-0 items-center justify-center"
                    >
                        <Text className={'text-center font-black text-3xl'}>{currentUser.points}</Text>
                        <Text className={'text-center font-black text-3xl'}>Punts</Text>
                    </View>
                </View>
                {currentUser.level === 5 ? (
                    <View className={'mt-4 w-full'}>
                        <View
                            className={'justify-between gap-2 flex-row'}
                        >
                            {[...Array(9).keys()].map(index => (
                                <FontAwesome
                                    style={{
                                        display: 'flex'
                                    }}
                                    key={index}
                                    name={'star'}
                                    color={brandColors.green}
                                    size={20}
                                    width={20}
                                />
                            ))}
                        </View>
                        <Text className={'mt-4'}>
                            Estàs al màxim nivell però pots continuar acumulant punts.
                        </Text>
                    </View>
                ) : (
                    <View className={'mt-4 justify-center w-full'}>
                        <View className={'h-3 w-full relative'}>
                            <LinearGradient
                                // @ts-ignore
                                colors={gradients[currentUser.level - 1]}
                                start={[0, 1]} end={[1, 0]}
                                style={{
                                    borderRadius: 40,
                                    position: 'relative',
                                    height: 11,
                                }}
                                className={'w-full h-3'}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    backgroundColor: 'black',
                                    width: 11,
                                    height: 11,
                                    borderRadius: 24,
                                    left: progressPercent as DimensionValue,
                                }}
                            ></View>
                        </View>
                        <Text className={'mt-4'}>
                            {i18n.t('experience_history.to_next_level', {points: (currentUser.next_level_starting_points - currentUser.points)})}
                        </Text>
                        <TouchableOpacity className={''} onPress={() => setModalVisible(true)}>
                            <Text
                                className={'text-right text-sm underline'}>{i18n.t('experience_history.how_to_button')}</Text>
                        </TouchableOpacity>
                        <ThemedModal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                            <Text className="font-bold">{i18n.t('experience_history.how_to_title')}</Text>
                            <View className={'gap-2'}>
                                <Text>{"\u2022" + " " + i18n.t('experience_history.how_to_text_1')}</Text>
                                <Text>{"\u2022" + " " + i18n.t('experience_history.how_to_text_2')}</Text>
                                <Text>{"\u2022" + " " + i18n.t('experience_history.how_to_text_3')}</Text>
                                <Text>{"\u2022" + " " + i18n.t('experience_history.how_to_text_4')}</Text>
                                <Text>{"\u2022" + " " + i18n.t('experience_history.how_to_text_5')}</Text>
                                <Text>{"\u2022" + " " + i18n.t('experience_history.how_to_text_6')}</Text>
                            </View>
                            <Pressable
                                className="px-4 py-2"
                                onPress={() => setModalVisible(false)}>
                                <Text
                                    className="text-brand-green font-bold">{i18n.t('product.report.form.close')}</Text>
                            </Pressable>
                        </ThemedModal>
                    </View>
                )}

                <Text className="mb-4 mt-4 font-bold text-xl">{i18n.t('experience_history.title')}</Text>
            </View>
        )
    };

    const ResultEmpty = () => {
        return (
            <View className={'bg-white p-6 rounded-xl'}>
                <Text>{i18n.t('experience_history.blank_state')}</Text>
            </View>
        )
    }

    return (
        <View className={'px-4'}>
            <FlatList
                ListHeaderComponent={getHeader}
                ListEmptyComponent={ResultEmpty}
                data={data}
                renderItem={renderItem}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.8}
                ListFooterComponent={ListEndLoader} // Loader when loading next page.
            />
        </View>
    );
}
