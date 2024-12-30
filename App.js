import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

export default function App() {
  const [zero, setZero] = useState(true);
  const [winner, setWinner] = useState(new Array(9).fill("empty"));
  const [gamewinner, setGamewinner] = useState("");

  const checkWinner = (updatedWinner) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        updatedWinner[a] === updatedWinner[b] &&
        updatedWinner[a] === updatedWinner[c] &&
        updatedWinner[a] !== "empty"
      ) {
        const winner = updatedWinner[a];
        setGamewinner(`${winner} won the game!`);

        Toast.show({
          type: "success",
          text1: "Congratulations!",
          text2: `${winner} has won the game! 🎉`,
          visibilityTime: 3000,
        });

        return true;
      }
    }

    if (!updatedWinner.includes("empty")) {
      setGamewinner("It's a draw!");
      Toast.show({
        type: "info",
        text1: "Game Over",
        text2: "It's a draw!",
        visibilityTime: 3000,
      });
      return true;
    }

    return false;
  };

  const onChangeItem = (itemIndex) => {
    if (gamewinner) {
      return;
    }

    if (winner[itemIndex] === "empty") {
      const updatedWinner = [...winner];
      updatedWinner[itemIndex] = zero ? "O" : "X";
      setWinner(updatedWinner);
      setZero(!zero);

      if (checkWinner(updatedWinner)) {
        return;
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid Move",
        text2: "Position already filled!",
        visibilityTime: 2000,
      });
    }
  };

  const reloadGame = () => {
    setZero(true);
    setWinner(new Array(9).fill("empty"));
    setGamewinner("");
  };

  return (
    <LinearGradient colors={["#6DD5FA", "#2980B9"]} style={styles.container}>
      <Toast />
      {gamewinner ? (
        <Text style={styles.gamewinnerText}>{gamewinner}</Text>
      ) : (
        <Text style={styles.turnText}>{zero ? "O's Turn" : "X's Turn"}</Text>
      )}

      <FlatList
        data={winner}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.card}
            onPress={() => onChangeItem(index)}
            disabled={item !== "empty" || !!gamewinner}
          >
            <Text style={[styles.cardText, { color: item === "O" ? "#0000FF" : "#FF0000" }]}>
              {item !== "empty" ? item : ""}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={styles.grid}
      />

      <Pressable style={styles.button} onPress={reloadGame}>
        <Text style={styles.buttonText}>{gamewinner?'Play again':'Restart'}</Text>
      </Pressable>
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  turnText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  gamewinnerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#32CD32",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  grid: {
    marginVertical: 20,
  },
  card: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  cardText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});
