import React, { ReactElement, useState } from "react"
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native"
import { LabelInput } from "../ui/labled-input"
import { getApiUrl } from "../core/get-api-url"
import { tokenJwt } from "./token"

interface Props {
  openChat: () => void
}

export const AuthPage = ({ openChat }: Props): ReactElement => {
  const [isSignUp, setIsSignUp] = useState(true)
  const [authData, setAuthData] = useState({ login: "", password: "" })

  const signUp = (login: string, password: string): void => {
    fetch(getApiUrl("auth/signup"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: login,
        password,
      }),
    }).then((response) => response.json())
  }

  const singIn = async (login: string, password: string): Promise<any> => {
    return await fetch(getApiUrl("auth/signin"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: login,
        password,
      }),
    }).then((response) => response.json())
  }

  const handleSubmit = async (): Promise<void> => {
    const { login, password } = authData

    if (isSignUp) {
      signUp(login, password)

      setIsSignUp(false)
      return
    }

    const data = await singIn(login, password)

    if (data.accessToken) {
      tokenJwt.value = data.accessToken
      openChat()
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign up" : "Sign in"}</Text>

      <LabelInput
        label="Login"
        value={authData.login}
        onChange={(value: string): void =>
          setAuthData({ ...authData, login: value })
        }
      />

      <LabelInput
        label="Password"
        value={authData.password}
        onChange={(value: string): void =>
          setAuthData({ ...authData, password: value })
        }
      />

      {isSignUp && (
        <TouchableOpacity
          style={styles.haveAcc}
          onPress={(): void => setIsSignUp(false)}
        >
          <Text>I already have account</Text>
        </TouchableOpacity>
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
  container: {
    height: "40%",
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  haveAcc: {
    marginVertical: 15,
  },
})
