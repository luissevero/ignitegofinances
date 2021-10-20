import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import { Signin } from '../screens/Signin'

const {Navigator, Screen} = createNativeStackNavigator()

export function AuthRoutes(){
    return(
        <Navigator>
            <Screen
                name="SignIn"
                component={Signin}
                options={{
                    headerShown: false
                }}
            />
        </Navigator>
    )
}


