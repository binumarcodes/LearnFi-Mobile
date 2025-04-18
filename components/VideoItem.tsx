import React, { forwardRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import VideoControls from "./VideoControls";
import QuizModal from "./QuizModal";

const { height, width } = Dimensions.get("window");

const VideoItem = forwardRef(
  (
    {
      source,
      profile,
      username,
      description,
      likes,
      comments,
      shares,
      quiz,
      quizCompleted,
      onQuizComplete,
      isQuizVisible,
      isHealthDepleted,
      timeRemaining,
      onRequestHealth,
      onPurchaseHealth,
    }: any,
    ref
  ) => {
    return (
      <View style={styles.container}>
        <Video
          ref={ref}
          source={source}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay
        />

        <VideoControls
          profile={profile}
          likes={likes}
          comments={comments}
          shares={shares}
        />

        <View style={styles.descriptionContainer}>
          <Image source={{ uri: profile }} style={styles.profileImage} />
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        {isHealthDepleted ? (
          <View style={styles.healthOverlay}>
            <View style={styles.healthCard}>
              <Text style={styles.healthEmoji}>💔</Text>
              <Text style={styles.healthTitle}>You're out of health!</Text>
              <Text style={styles.healthSubtitle}>Next quiz available in</Text>
              <Text style={styles.timerText}>{timeRemaining}</Text>

              <TouchableOpacity
                onPress={onRequestHealth}
                style={styles.primaryButton}
              >
                <Text style={styles.buttonText}>🤝 Request Health</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPurchaseHealth}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondarybuttonText}>🛒 Purchase Health</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <QuizModal
            visible={isQuizVisible && quiz && !quizCompleted}
            question={quiz?.question}
            options={quiz?.options}
            answer={quiz?.answer}
            onQuizComplete={onQuizComplete}
          />
        )}
      </View>
    );
  }
);

export default VideoItem;

const styles = StyleSheet.create({
  container: {
    height,
    width,
    justifyContent: "center",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  descriptionContainer: {
    position: "absolute",
    bottom: 30,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
    width: "90%",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    color: "#fff",
    fontSize: 14,
  },
  healthOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  healthCard: {
    backgroundColor: "#1f1f1f",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  healthEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  healthTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  healthSubtitle: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  timerText: {
    color: "#00cec9",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 25,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#00b894",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "gold",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondarybuttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
