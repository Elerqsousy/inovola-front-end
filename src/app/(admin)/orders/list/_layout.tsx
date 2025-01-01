import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from "react-native-safe-area-context";

// https://reactnavigation.org/docs/material-top-tab-navigator/

/* Technical Debt */
/*
Integrate ios handeling from link above on IOS machine
*/

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator)

function OrderListNavigator() {
    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
            <TopTabs>
                <TopTabs.Screen name="index" options={{title: 'Active'}} />
            </TopTabs>
        </SafeAreaView>
    )
}

export default OrderListNavigator;
