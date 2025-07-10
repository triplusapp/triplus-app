import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {searchService} from "@/src/api/services/searchService";
import {SearchableType} from "@/src/types/search";
import {useCompanyStore} from "@/src/stores/companyStore";
import {Company} from "@/src/types/company";
import {useAuth} from "@/src/auth";
import i18n from "@/src/i18n";

type Props = NativeStackScreenProps<CommonStackParamList, 'Product'>;

export default function CompanyCard({company, registerStory = false}: { company: Company, registerStory: boolean }) {
    const navigation = useNavigation<Props['navigation']>();
    const {setCompany} = useCompanyStore();
    const {isAuthenticated} = useAuth();

    return (
        <View className="">
            <Pressable
                onPress={() => {
                setCompany(company);
                navigation.push('Company', {id: company.id});
                if (isAuthenticated && registerStory) {
                    searchService.addSearchHistory(company.id, SearchableType.Company)
                }
            }}
                className={'w-full overflow-hidden flex flex-row p-4 items-center bg-white rounded-xl'}
            >
                <Image
                    placeholder={require("../../assets/images/image-placeholder.png")}
                    source={{uri: company.media[0]?.preview}}
                    style={styles.image}/>

                <View
                    className="ml-4 grow shrink"
                >
                    <Text className="text-xl truncate">{company.name}</Text>
                    <Text className={'text-gray-400'}>{i18n.t('search.company_num_products', {count:company.num_products})}</Text>
                    {company.num_requested_products > 0 && (
                        <Text className={'text-gray-400'}>{i18n.t('search.company_num_requested_products', {count:company.num_requested_products})}</Text>
                    )}
                </View>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    image: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        overflow: "hidden",
    },
    stamp: {
        height: 50,
        width: 50,
    }
})
