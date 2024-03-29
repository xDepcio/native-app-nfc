import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import NfcManager from "react-native-nfc-manager";
import { useSelector } from "react-redux";
import AndroidPrompt from "./AndroidPrompt";
import DataDisplay from "./DataDisplay";
import NfcExample from "./NfcExample";
import ReadWriteNfc from "./ReadWriteNfc";
import ScanTag from "./ScanTag";
import SoundExample from "./SoundExample";

function App(props) {
    const [hasNfc, setHasNfc] = useState(null)
    const [enabled, setEnabled] = useState(null)
    const tagData = useSelector((state) => state.tag.data)

    useEffect(() => { // wstępny setup, sprawdza czy telefon ma NFC (hasNfc) i czy NFC jest włączone w ustawieniach (enabled)
        async function checkNfc() {
            const supported = await NfcManager.isSupported()
            if(supported) {
                await NfcManager.start()
                setEnabled(await NfcManager.isEnabled())
            }
            setHasNfc(supported)
        }

        checkNfc()
    }, [])

    if(hasNfc === null) {
        return null
    }
    else if(!hasNfc) (
        <View style={styles.wrapper}>
            <Text>Your device doesn't support NFC</Text>
        </View>
    )
    else if(!enabled) {
        <View style={styles.wrapper}>
            <Text>Your NFC is not enabled</Text>

            <TouchableOpacity onPress={() => {
                NfcManager.goToNfcSetting()
            }}>
                <Text>GO TO SETTINGS</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async () => {
                setEnabled(await NfcManager.isEnabled())
            }}>
                <Text>CHECK AGAIN</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <View style={styles.wrapper}>
            {tagData && (
                <DataDisplay />
            )}
            <ScanTag />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#ebeaea'
    }
})

export default App
