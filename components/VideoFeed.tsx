import React, { useRef, useState, useEffect, useCallback } from "react";
import { FlatList, Dimensions, View, Text, ActivityIndicator } from "react-native";
import VideoItem from "./VideoItem"; // Assuming you have a VideoItem component for rendering videos

const { height } = Dimensions.get("window");

interface VideoData {
  id: string;
  videoUrl: any;  // Now expecting a local video file
  profile?: string;
  username?: string;
  description?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  quiz?: any;
}

export default function VideoFeed() {
  const flatListRef = useRef<FlatList<any>>(null);
  const videoRefs = useRef<any[]>([]);

  const [videos, setVideos] = useState<VideoData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastWatchedIndex, setLastWatchedIndex] = useState(-1);
  const [quizCompleted, setQuizCompleted] = useState<{ [key: string]: boolean }>({});
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const [health, setHealth] = useState(5);
  const [xp, setXp] = useState(0); // New state for XP
  const [loading, setLoading] = useState(true);
  const [isHealthDepleted, setIsHealthDepleted] = useState(false);
const [healthRestoreTime, setHealthRestoreTime] = useState<Date | null>(null);
const [timeRemaining, setTimeRemaining] = useState('');


  // Local videos (stored in the assets folder)
  const dummyVideos: VideoData[] = [
    {
      id: "1",
      videoUrl: require("../assets/video1.mp4"),  // Local video file
      profile: "https://randomuser.me/api/portraits/men/1.jpg",
      username: "mentor_abdul",
      description: "Learning about Algebra",
      likes: 123,
      comments: 45,
      shares: 20,
      quiz: {
        question: "What is 5 + 3?",
        options: ["6", "7", "8", "9"],
        answer: "8",
      },
    },
    {
      id: "2",
      videoUrl: require("../assets/video2.mp4"),  // Local video file
      profile: "https://randomuser.me/api/portraits/women/2.jpg",
      username: "jane_code",
      description: "Understanding quadratic equations",
      likes: 98,
      comments: 30,
      shares: 15,
      quiz: {
        question: "What is the solution to the equation x^2 - 5x + 6 = 0?",
        options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = -1, 5"],
        answer: "x = 2, 3",
      },
    },
    {
      id: "3",
      videoUrl: require("../assets/video3.mp4"),  // Local video file
      profile: "https://randomuser.me/api/portraits/men/3.jpg",
      username: "tech_sam",
      description: "Intro to Trigonometry",
      likes: 145,
      comments: 60,
      shares: 25,
      quiz: {
        question: "What is the sine of a 90-degree angle?",
        options: ["0", "0.5", "1", "undefined"],
        answer: "1",
      },
    },
    {
      id: "4",
      videoUrl: require("../assets/video4.mp4"),  // Local video file
      profile: "https://randomuser.me/api/portraits/women/2.jpg",
      username: "jane_code",
      description: "Understanding Newton's laws of motion",
      likes: 98,
      comments: 30,
      shares: 15,
      quiz: {
        question: "Which of the following is Newton's second law?",
        options: ["F = ma", "F = mv", "E = mc^2", "P = mv"],
        answer: "F = ma",
      },
    },
    {
      id: "5",
      videoUrl: require("../assets/video5.mp4"),  // Local video file
      profile: "https://randomuser.me/api/portraits/men/3.jpg",
      username: "tech_sam",
      description: "Understanding laws of thermodynamics",
      likes: 145,
      comments: 60,
      shares: 25,
      quiz: {
        question: "What is the first law of thermodynamics?",
        options: [
          "Energy cannot be created or destroyed.",
          "Entropy increases over time.",
          "The total energy of an isolated system remains constant.",
          "Work is done by a system when heat flows into it."
        ],
        answer: "Energy cannot be created or destroyed.",
      },
    },
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      setVideos(dummyVideos); // Use the dummy data instead of Firestore data
      setLoading(false);
    };

    fetchVideos();
  }, []);

  // Handle when quiz is completed
  const handleQuizCompletion = (videoId: string, isCorrect: boolean) => {
    if (!isCorrect) {
      const newHealth = Math.max(0, health - 1);
      setHealth(newHealth);
      alert("Incorrect answer. You must get the quiz right to proceed.");
      setIsQuizVisible(true);
  
      if (newHealth === 0) {
        const restoreDate = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours from now
        setIsHealthDepleted(true);
        setHealthRestoreTime(restoreDate);
      }
      return;
    }
  
    setQuizCompleted((prev) => ({ ...prev, [videoId]: true }));
    setIsQuizVisible(false);
    setXp((prevXp) => prevXp + 10);
  };

  
  useEffect(() => {
    if (!isHealthDepleted || !healthRestoreTime) return;
  
    const interval = setInterval(() => {
      const now = new Date();
      const difference = healthRestoreTime.getTime() - now.getTime();
  
      if (difference <= 0) {
        setHealth(5);
        setIsHealthDepleted(false);
        setHealthRestoreTime(null);
        setTimeRemaining('');
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [isHealthDepleted, healthRestoreTime]);
  

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (!viewableItems || viewableItems.length === 0) return;
      const newIndex = viewableItems[0].index;

      if (isQuizVisible || quizCompleted[viewableItems[0].item.id]) return;

      setActiveIndex(newIndex);

      videoRefs.current.forEach((video, index) => {
        if (video && typeof video.playAsync === "function") {
          if (index === newIndex) {
            // Play the video if quiz is not visible
            if (!isQuizVisible) {
              video.playAsync();
            }
          } else {
            // Pause the video if it's not the active one
            video.pauseAsync();
          }
        }
      });
    },
    [isQuizVisible, quizCompleted]
  );

  const onMomentumScrollEnd = () => {
    const currentVideo = videos[activeIndex];

    if (!currentVideo || !currentVideo.quiz) {
      setIsQuizVisible(false);
      return;
    }

    // Show the quiz only when the user scrolls and quiz is not yet completed
    if (activeIndex > lastWatchedIndex && !quizCompleted[currentVideo.id]) {
      setIsQuizVisible(true);
      // Pause the video when quiz is shown
      videoRefs.current[activeIndex]?.pauseAsync();
    }

    // Automatically play the video when the quiz is hidden
    if (!isQuizVisible) {
      videoRefs.current[activeIndex]?.playAsync();
    }

    setLastWatchedIndex(activeIndex);
  };

  useEffect(() => {
    if (!isQuizVisible && videoRefs.current[activeIndex]) {
      // Play the video when quiz is hidden
      videoRefs.current[activeIndex]?.playAsync();
    } else if (isQuizVisible && videoRefs.current[activeIndex]) {
      // Pause the video when quiz is visible
      videoRefs.current[activeIndex]?.pauseAsync();
    }
  }, [isQuizVisible, activeIndex]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <>
      {/* Health and XP Display */}
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 1,
          backgroundColor: "black",
          padding: 10,
          borderRadius: 5,
          flexDirection: "row", // Arrange items horizontally
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, marginRight: 10 }}>
          ❤️ Health: {health}
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 1,
          backgroundColor: "black",
          padding: 10,
          borderRadius: 5,
          flexDirection: "row", // Arrange items horizontally
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          💎 XP: {xp}
        </Text>
      </View>

      {/* Video Feed */}
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index }) => (
          <VideoItem
            ref={(ref) => {
              if (ref) videoRefs.current[index] = ref;
            }}
            source={item.videoUrl}  // Using the local video URL
            profile={item.profile}
            username={item.username}
            description={item.description}
            likes={item.likes}
            comments={item.comments}
            shares={item.shares}
            quiz={item.quiz}
            
            quizCompleted={quizCompleted[item.id] || false}
            onQuizComplete={(isCorrect: boolean) =>
              handleQuizCompletion(item.id, isCorrect)
            }
            isQuizVisible={isQuizVisible && lastWatchedIndex === index}
  isHealthDepleted={isHealthDepleted}
  timeRemaining={timeRemaining}
          />
        )}
      />
    </>
  );
}
