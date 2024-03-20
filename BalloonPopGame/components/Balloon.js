import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");
import BalloonImage from "../assets/balloon.png";

const Balloon = () => {
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);

  const [balloons, setBalloons] = useState([]);

  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setgameStarted] = useState(false);

  const [popped, setPopped] = useState(0);
  const [missed, setMissed] = useState(0);

  const widthArray = [0,width / 5,(2 * width) / 5,(3 * width) / 5,(4 * width) / 5,];

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        setTimeLeft((time) => {
          if (time === 0) {
            setgameStarted(false);
            clearInterval(timer);
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  useEffect(() => {
    let ballontimer;

    if (gameStarted) {
      ballontimer = setInterval(() => {
        if (balloons.length < 15) {
          setBalloons((prevBalloons) => [
            ...prevBalloons,
            {
              id: Math.random().toString(),
              position: {
                x: widthArray[Math.floor(Math.random() * widthArray.length)],
                y: height,
              },
              opacity: new Animated.Value(0.75),
            },
          ]);
        }
      }, 1000);

      setgameTime = setTimeout(() => {
        setgameStarted(false);
        clearInterval(ballontimer);
      }, 120000);

      return () => {
        clearInterval(ballontimer);
        clearTimeout(setgameTime);
      };
    }
  }, [gameStarted, balloons.length]);

  const handleBalloonPress = (balloonId) => {
    setScore((score) => score + 2);
    setPopped((popped) => popped + 1);
    setBalloons((prev) => prev.filter((balloon) => balloon.id !== balloonId));
  };

  const generateBallons = () => {
    setBalloons((prevBalloons) =>
      prevBalloons
        .map((balloon) => ({
          ...balloon,
          position: {
            x: balloon.position.x,
            y: balloon.position.y - 10,
          },
        }))
        .filter((balloon) => {
          if (balloon.position.y < 140) {
            setScore((prevScore) => Math.max(0, prevScore - 1));
            setMissed((missed) => missed + 1);
            return false;
          }
          return true;
        })
    );
  };

  useEffect(() => {
    if (gameStarted) {
      const generatetimer = setInterval(generateBallons, 45);
      return () => clearInterval(generatetimer);
    }
  }, [generateBallons]);

  const handleGameReset = () => {
    setPreviousScore(score);
    setScore(0);
    setBalloons([]);
    setTimeLeft(120);
    setPopped(0);
    setMissed(0);
    setgameStarted(true);
  };

  return (
    <View style={styles.container}>
      {gameStarted && (
        <>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>Score: {score}</Text>
            <Text style={styles.timeleft}>Time Left: {timeLeft} s</Text>
          </View>
          <View style={styles.infoContainer1}>
            <Text style={styles.popped}>Balloons Popped: {popped}</Text>
            <Text style={styles.missed}>Balloons Missed: {missed}</Text>
          </View>

          <>
            {balloons.map((balloon) => (
              <TouchableOpacity
                key={balloon.id}
                style={[
                  styles.balloon,
                  {
                    top: balloon.position.y,
                    left: balloon.position.x,
                    opacity: balloon.opacity,
                  },
                ]}
                onPress={() => {
                  Animated.timing(balloon.opacity, {
                    toValue: 0,
                    duration: 1,
                    useNativeDriver: true,
                  }).start(() => {
                    handleBalloonPress(balloon.id);
                  });
                }}
              >
                <Image
                  style={styles.image}
                  source={BalloonImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </>
        </>
      )}
      {!gameStarted && (
        <>
          <TouchableOpacity style={styles.startButton} onPress={handleGameReset}>
            <Text style={styles.startTitle}>Pop it!</Text>
            <Text style={styles.btntext}>Play!</Text>
            <Text style={styles.finalScore}> Your Score: {previousScore}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scoreContainer: {
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  infoContainer1: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  score: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
  },
  timeleft: {
    fontSize: 18,
    color: "#333",
  },
  popped: {
    color: "green",
  },
  missed: {
    color: "red",
  },
  startTitle: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "blue",
  },
  startButton: {
    flex: 1,
    justifyContent: "center",
  },
  btntext: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "blue",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    textAlign: "center",
  },
  finalScore: {
    marginTop: 10,
    fontSize: 20,
    color: "#333",
  },
  balloon: {
    position: "absolute",
  },
  image: {
    width: 70,
    height: 70,
  },
});

export default Balloon;
