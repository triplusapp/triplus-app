import {LayoutChangeEvent, Pressable, Text, View} from 'react-native';
import React, {useEffect, useState} from "react";
import Title from "@/components/screens/Title";
import * as Linking from "expo-linking";
import Toast from "react-native-root-toast";
import i18n from "@/src/i18n";

export default function ContactScreen() {
    return (
        <View className={'mt-8 gap-8 px-4'}>
            <View>
                <Title text={i18n.t('contact.phone')}/>
                <Text>722 46 53 37</Text>
            </View>

            <View>
                <Title text={i18n.t('contact.telegram')}/>
                <Text>722 46 53 37</Text>
            </View>

            <View>
                <Title text={i18n.t('contact.email')}/>

                <Text className={'mt-4'}>{i18n.t('contact.email1')}</Text>
                <Pressable
                    onPress={() => {
                        Linking.openURL('mailto:app@triplus.app').catch(error => {
                            console.log(error.message)
                            Toast.show(error.message, {
                                shadow: false,
                                textStyle: {
                                    fontSize: 12
                                }
                            })
                        })
                    }}
                    className="active:bg-gray-100"
                >
                    <Text className={'text-lg underline'}>app@triplus.app</Text>
                </Pressable>
            </View>

            <View>
                <Text>{i18n.t('contact.email2')}</Text>
                <Pressable
                    onPress={() => {
                        Linking.openURL('mailto:empreses@triplus.app').catch(error => {
                            console.log(error.message)
                            Toast.show(error.message, {
                                shadow: false,
                                textStyle: {
                                    fontSize: 12
                                }
                            })
                        })
                    }}
                    className="active:bg-gray-100"
                >
                    <Text className={'text-lg underline'}>empreses@triplus.app</Text>
                </Pressable>
            </View>

            <View>
                <Text>{i18n.t('contact.email3')}</Text>
                <Pressable
                    onPress={() => {
                        Linking.openURL('mailto:info@triplus.app').catch(error => {
                            console.log(error.message)
                            Toast.show(error.message, {
                                shadow: false,
                                textStyle: {
                                    fontSize: 12
                                }
                            })
                        })
                    }}
                    className="active:bg-gray-100"
                >
                    <Text className={'text-lg underline'}>info@triplus.app</Text>
                </Pressable>
            </View>
        </View>
    );
}
