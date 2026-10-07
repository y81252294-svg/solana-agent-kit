import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Alert,
  Modal,
  Pressable,
  BackHandler,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/assets/colors';
import { useChat } from '@/hooks/useChat';
import { generateUUID } from '@/lib/utils';
import { useRoute, useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { useWallet } from '@/walletProviders';
import type { Message } from 'ai';
import ErrorHandler from '@/components/ErrorHandler';

const { width, height } = Dimensions.get('window');

// Token Card Component for Portfolio Responses
const TokenCard = memo(({ token }: { token: any }) => {
  return (
    <LinearGradient
      colors={['rgba(50, 50, 50, 0.6)', 'rgba(40, 40, 40, 0.7)']}
      style={styles.tokenCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.tokenCardHeader}>
        <View style={styles.tokenNameContainer}>
          <Text style={styles.tokenName}>{token.name}</Text>
          {token.symbol && <Text style={styles.tokenSymbol}>({token.symbol})</Text>}
        </View>
        <View style={styles.tokenBalanceContainer}>
          <Text style={styles.tokenBalance}>{token.balance}</Text>
        </View>
      </View>
      
      {token.address && (
        <View style={styles.tokenAddressContainer}>
          <Text style={styles.tokenAddressLabel}>Address:</Text>
          <Text style={styles.tokenAddress} numberOfLines={1} ellipsizeMode="middle">
            {token.address}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
});

// Portfolio Component
const PortfolioDisplay = memo(({ data }: { data: any }) => {
  return (
    <View style={styles.portfolioContainer}>
      {data.solBalance && (
        <LinearGradient
          colors={[COLORS.brandPrimary, '#2AABB3']}
          style={styles.solBalanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.solBalanceContent}>
            <Ionicons name="wallet-outline" size={24} color="white" />
            <Text style={styles.solBalanceLabel}>SOL Balance</Text>
            <Text style={styles.solBalanceValue}>{data.solBalance}</Text>
          </View>
        </LinearGradient>
      )}
      
      {data.tokens && data.tokens.length > 0 && (
        <View style={styles.tokensListContainer}>
          <Text style={styles.tokenListTitle}>Tokens</Text>
          {data.tokens.map((token: any, index: number) => (
            <TokenCard key={`token-${index}`} token={token} />
          ))}
        </View>
      )}
    </View>
  );
});

// Formatted Text Component
const FormattedText = memo(({ text, style }: { text: string, style?: any }) => {
  const formatText = (content: string) => {
    // Format patterns like **bold** to styled text
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    
    // Split the text by patterns and restore the formatting tags with components
    let parts: Array<{ type: 'regular' | 'bold' | 'italic', content: string }> = [];
    let lastIndex = 0;
    
    // Process bold patterns first
    const boldMatches = [...content.matchAll(boldPattern)];
    for (const match of boldMatches) {
      if (match.index !== undefined) {
        // Add regular text before the match
        if (match.index > lastIndex) {
          parts.push({ 
            type: 'regular', 
            content: content.substring(lastIndex, match.index) 
          });
        }
        
        // Add the bold text without the ** markers
        parts.push({ 
          type: 'bold', 
          content: match[1] 
        });
        
        lastIndex = match.index + match[0].length;
      }
    }
    
    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push({ 
        type: 'regular', 
        content: content.substring(lastIndex) 
      });
    }
    
    // Process italic in each text part
    const finalParts: Array<{ type: 'regular' | 'bold' | 'italic', content: string }> = [];
    
    for (const part of parts) {
      if (part.type !== 'bold') {
        // Only process italic in non-bold text
        let italicParts: typeof finalParts = [];
        let lastItalicIndex = 0;
        
        const italicMatches = [...part.content.matchAll(italicPattern)];
        for (const match of italicMatches) {
          if (match.index !== undefined) {
            // Add regular text before the match
            if (match.index > lastItalicIndex) {
              italicParts.push({ 
                type: 'regular', 
                content: part.content.substring(lastItalicIndex, match.index) 
              });
            }
            
            // Add the italic text without the * markers
            italicParts.push({ 
              type: 'italic', 
              content: match[1] 
            });
            
            lastItalicIndex = match.index + match[0].length;
          }
        }
        
        // Add any remaining text
        if (lastItalicIndex < part.content.length) {
          italicParts.push({ 
            type: 'regular', 
            content: part.content.substring(lastItalicIndex) 
          });
        }
        
        finalParts.push(...italicParts);
      } else {
        // Keep bold parts as is
        finalParts.push(part);
      }
    }
    
    // Render each part with appropriate styling
    return (
      <Text style={style}>
        {finalParts.map((part, index) => {
          if (part.type === 'bold') {
            return <Text key={index} style={styles.boldText}>{part.content}</Text>;
          } else if (part.type === 'italic') {
            return <Text key={index} style={styles.italicText}>{part.content}</Text>;
          } else {
            return <Text key={index}>{part.content}</Text>;
          }
        })}
      </Text>
    );
  };

  // Process lists from markdown-ish format
  const formatLists = (content: string) => {
    // Split by new lines and look for list patterns
    const lines = content.split('\n');
    let inList = false;
    let listItems: string[] = [];
    let formattedBlocks: JSX.Element[] = [];
    let currentText = '';
    
    lines.forEach((line, index) => {
      // Check if line is a list item (starts with - or *)
      const listItemMatch = line.match(/^\s*[-*]\s+(.*)/);
      
      if (listItemMatch) {
        // If we weren't in a list, add the accumulated text first
        if (!inList && currentText) {
          formattedBlocks.push(formatText(currentText));
          currentText = '';
        }
        
        inList = true;
        listItems.push(listItemMatch[1]);
      } else {
        // If we're leaving a list, render it
        if (inList && listItems.length > 0) {
          formattedBlocks.push(
            <View key={`list-${formattedBlocks.length}`} style={styles.listContainer}>
              {listItems.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listItemText, style]}>{formatText(item)}</Text>
                </View>
              ))}
            </View>
          );
          listItems = [];
          inList = false;
        }
        
        // Add this line to the current text block
        currentText += (currentText ? '\n' : '') + line;
      }
    });
    
    // Handle any remaining list
    if (inList && listItems.length > 0) {
      formattedBlocks.push(
        <View key={`list-${formattedBlocks.length}`} style={styles.listContainer}>
          {listItems.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={[styles.listItemText, style]}>{formatText(item)}</Text>
            </View>
          ))}
        </View>
      );
    }
    
    // Handle any remaining text
    if (currentText) {
      formattedBlocks.push(formatText(currentText));
    }
    
    // If no blocks were created (indicating no formatting needed), just use the original text
    if (formattedBlocks.length === 0) {
      return formatText(content);
    }
    
    return (
      <>
        {formattedBlocks.map((block, index) => (
          <View key={index} style={index > 0 ? { marginTop: 8 } : undefined}>
            {block}
          </View>
        ))}
      </>
    );
  };
  
  return formatLists(text);
});

// ChatGPT-style typing indicator that appears in the message stream
const TypingIndicator = ({ operation }: { operation: string }) => {
  // Default message when no specific operation is provided
  const defaultMessage = "Processing your request...";
  
  // Use the real operation status or default message
  const statusMessage = operation || defaultMessage;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Animation values for dots
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.7)).current;
  const dot3Anim = useRef(new Animated.Value(1)).current;
  
  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Glow animation
  useEffect(() => {
    const pulseGlow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
    
    pulseGlow.start();
    
    return () => {
      pulseGlow.stop();
    };
  }, []);
  
  // Animate the typing dots
  useEffect(() => {
    const animateDots = () => {
      // Reset dots to starting opacity
      dot1Anim.setValue(0.4);
      dot2Anim.setValue(0.7);
      dot3Anim.setValue(1);
      
      // Sequence the dot animations
      Animated.sequence([
        // First dot animation
        Animated.timing(dot1Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Second dot animation
        Animated.timing(dot2Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Third dot animation
        Animated.timing(dot3Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Pause at the end
        Animated.delay(200),
      ]).start(() => {
        // Loop the animation
        animateDots();
      });
    };
    
    animateDots();
    
    return () => {
      dot1Anim.stopAnimation();
      dot2Anim.stopAnimation();
      dot3Anim.stopAnimation();
    };
  }, []);
  
  const glowShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  
  return (
    <Animated.View 
      style={[
        styles.messageContainer,
        styles.systemMessage,
        { opacity: fadeAnim }
      ]}
    >
      <Animated.View
        style={[
          styles.typingMessageBubble,
          {
            shadowOpacity: glowOpacity,
            shadowRadius: glowShadow,
          }
        ]}
      >
        <View style={styles.typingHeader}>
          <Ionicons name="logo-electron" size={16} color="#32D4DE" style={styles.typingIcon} />
          <Text style={styles.typingHeaderText}>AI Assistant</Text>
        </View>
        
        <View style={styles.typingContent}>
          <Text style={styles.typingMessage}>{statusMessage}</Text>
          
          <View style={styles.typingDotsContainer}>
            <Animated.View style={[styles.typingDot, { opacity: dot1Anim }]} />
            <Animated.View style={[styles.typingDot, { opacity: dot2Anim }]} />
            <Animated.View style={[styles.typingDot, { opacity: dot3Anim }]} />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// Parse crypto data for better formatting
const parseCryptoData = (text: string) => {
  // Check for cryptocurrency price patterns
  const cryptoPattern = /(Bitcoin|Ethereum|Solana|ETH|BTC|SOL).*?(\$[\d,]+\.?\d*)/gi;
  const matches = [...text.matchAll(cryptoPattern)];
  
  if (matches.length > 0) {
    const cryptos = matches.map(match => ({
      name: match[1].trim(),
      price: match[2].trim()
    }));
    
    return {
      isCryptoPrice: true,
      cryptos
    };
  }
  
  return {
    isCryptoPrice: false
  };
};

// Parse portfolio data from message text
const parsePortfolioData = (text: string) => {
  // Check if this is portfolio data
  if (text.includes("SOL Balance") && text.includes("Token")) {
    try {
      // Extract SOL balance
      const solBalanceMatch = text.match(/SOL Balance.*?(\d+\.\d+)/);
      const solBalance = solBalanceMatch ? solBalanceMatch[1] : null;
      
      // Extract tokens
      const tokens = [];
      const tokenMatches = text.matchAll(/\d+\.\s\*\*(.*?)(?:\((.*?)\))?\*\*\s*\n\s*-\s*Balance:\s*([\d\.]+)\s*\n\s*-\s*Token Address:\s*([a-zA-Z0-9]+)/g);
      
      for (const match of tokenMatches) {
        tokens.push({
          name: match[1].trim(),
          symbol: match[2] ? match[2].trim() : null,
          balance: match[3].trim(),
          address: match[4].trim()
        });
      }
      
      if (solBalance || tokens.length > 0) {
        return {
          isPortfolio: true,
          solBalance,
          tokens
        };
      }
    } catch (e) {
      console.error("Error parsing portfolio:", e);
    }
  }
  
  return {
    isPortfolio: false
  };
};

// Component to display cryptocurrency prices in a nice format
const CryptoPriceDisplay = memo(({ data }: { data: any }) => {
  return (
    <View style={styles.cryptoPriceContainer}>
      {data.cryptos.map((crypto: { name: string; price: string }, index: number) => (
        <LinearGradient
          key={`crypto-${index}`}
          colors={['rgba(50, 50, 50, 0.6)', 'rgba(40, 40, 40, 0.7)']}
          style={styles.cryptoPriceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cryptoPriceHeader}>
            <Ionicons 
              name="cash-outline" 
              size={24} 
              color={COLORS.brandPrimary} 
            />
            <Text style={styles.cryptoName}>
              {crypto.name.toLowerCase().includes('btc') ? 'Bitcoin' : 
               crypto.name.toLowerCase().includes('eth') ? 'Ethereum' : 
               crypto.name.toLowerCase().includes('sol') ? 'Solana' : 
               crypto.name}
            </Text>
          </View>
          <Text style={styles.cryptoPrice}>{crypto.price}</Text>
        </LinearGradient>
      ))}
    </View>
  );
});

// Memoized message component to prevent unnecessary rerenders
const ChatMessage = memo(({ item, formatTime, isLastMessage }: { 
  item: any, 
  formatTime: (timestamp: Date | string | undefined) => string,
  isLastMessage: boolean
}) => {
  const isUser = item.role === 'user';
  // Ensure we extract text content consistently
  const messageText = item.content || 
    item.parts?.find((part: any) => part.type === 'text')?.text || 
    '';
  const timestamp = item.createdAt ? new Date(item.createdAt) : new Date();
  
  // Animated values for fade-in effect
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Parse for special message types
  const portfolioData = useMemo(() => parsePortfolioData(messageText), [messageText]);
  const cryptoData = useMemo(() => !isUser && !portfolioData.isPortfolio ? parseCryptoData(messageText) : { isCryptoPrice: false }, [messageText, isUser, portfolioData.isPortfolio]);
  
  // Adjust the width of messages that contain structured data
  const hasStructuredData = !isUser && (portfolioData.isPortfolio || cryptoData.isCryptoPrice);
  
  useEffect(() => {
    // Animate the message appearance
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View 
      style={[
        styles.messageContainer, 
        isUser ? styles.userMessage : styles.systemMessage,
        hasStructuredData && styles.structuredMessageContainer,
        { opacity }
      ]}
    >
      <LinearGradient
        colors={isUser ? ['#32D4DE', '#2AABB3'] : ['#2A2A2A', '#303030']}
        style={[
          styles.messageBubble, 
          isLastMessage && isUser && styles.lastUserMessage,
          hasStructuredData && styles.structuredMessageBubble
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Display message based on content type */}
        {isUser ? (
          <Text style={styles.messageText}>{messageText}</Text>
        ) : portfolioData.isPortfolio ? (
          <PortfolioDisplay data={portfolioData} />
        ) : cryptoData.isCryptoPrice ? (
          <CryptoPriceDisplay data={cryptoData} />
        ) : (
          <FormattedText text={messageText} style={styles.messageText} />
        )}
        <Text style={styles.timestampText}>{formatTime(timestamp)}</Text>
      </LinearGradient>
    </Animated.View>
  );
});

ChatMessage.displayName = 'ChatMessage';
TokenCard.displayName = 'TokenCard';
PortfolioDisplay.displayName = 'PortfolioDisplay';
FormattedText.displayName = 'FormattedText';
CryptoPriceDisplay.displayName = 'CryptoPriceDisplay';

export default function ChatScreen() {
  // Get route parameters first outside of any hooks
  const route = useRoute();
  const navigation = useNavigation();
  const routeParams = (route.params as { id?: string; title?: string }) || {};
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Chat options menu state
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Then initialize chatId in a consistent manner
  const [chatId] = useState(() => routeParams.id || generateUUID());
  const [chatTitle, setChatTitle] = useState(routeParams.title || 'New Chat');
  
  const { connected } = useWallet();
  
  // Call useChat after ensuring chatId is always available
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    deleteChat,
    input, 
    setInput,
    status,
    setError,
    currentOperation // Get the current operation from useChat
  } = useChat({ 
    id: chatId,
    initialMessages: routeParams.id ? undefined : [],
    isExistingChat: !!routeParams.id
  });
  
  const flatListRef = useRef<FlatList>(null);

  // Handle hardware back button on Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  // Animate screen appearance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Scroll to bottom when new messages come in
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages.length]);

  const handleSendMessage = useCallback(() => {
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    if (input.trim().length === 0) {
      setError("Message cannot be empty");
      return;
    }
    
    // Create a properly formatted message object with required text field
    const messageText = input.trim();
    const newMessage: Message = {
      id: generateUUID(),
      content: messageText,
      role: "user",
      parts: [{ 
        type: "text" as const, 
        text: messageText 
      }],
    };
    
    // Clear input before message appears for better UX
    setInput('');
    sendMessage(newMessage);
  }, [input, sendMessage, setInput, connected, setError]);

  const formatTime = useCallback((timestamp: Date | string | undefined): string => {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const renderMessage = useCallback(({ item, index }: { item: any, index: number }) => {
    const isLastMessage = index === messages.length - 1;
    return <ChatMessage 
      item={item} 
      formatTime={formatTime} 
      isLastMessage={isLastMessage} 
    />;
  }, [formatTime, messages.length]);

  const navigateBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If we can't go back, navigate to chat history using CommonActions
      navigation.dispatch(
        CommonActions.navigate({
          name: 'ChatHistory'
        })
      );
    }
  }, [navigation]);

  // Memoize keyboard avoiding view offset
  const keyboardOffset = useMemo(() => Platform.OS === "ios" ? 90 : 0, []);

  const emptyListComponent = useMemo(() => (
    <Animated.View 
      style={[
        styles.emptyContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Ionicons name="chatbubble-ellipses-outline" size={60} color={COLORS.darkText.tertiary} />
      <Text style={styles.emptyText}>
        Start a conversation with the Solana AI Assistant
      </Text>
      <Text style={styles.emptySubtext}>
        Ask questions about Solana, create transactions, or manage your assets
      </Text>
    </Animated.View>
  ), [fadeAnim, slideAnim]);

  const handleDeleteChat = useCallback(() => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setMenuVisible(false);
            const success = await deleteChat();
            if (success) {
              // Navigate back with a param indicating deletion happened
              // This allows the ChatHistory screen to refresh its data
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'ChatHistory',
                  params: {
                    chatDeleted: true,
                    deletedChatId: chatId,
                    timestamp: new Date().getTime()
                  }
                })
              );
            } else {
              setError("Failed to delete chat. Please try again.");
            }
          }
        }
      ]
    );
  }, [deleteChat, navigation, setError, chatId]);

  const toggleMenu = useCallback(() => {
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      
      <LinearGradient
        colors={['#1A1A1A', '#121212', '#050505']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative elements - added to match other screens */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <LinearGradient
          colors={['rgba(50, 212, 222, 0.05)', 'transparent']}
          style={styles.glow1}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
            <Ionicons name="chevron-back" size={24} color={COLORS.darkText.primary} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {chatTitle}
            </Text>
            {!connected && (
              <Text style={styles.walletWarning}>Wallet not connected</Text>
            )}
          </View>
          
          {routeParams.id ? (
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Ionicons name="ellipsis-vertical" size={24} color={COLORS.darkText.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.menuButton} />
          )}
        </Animated.View>
        
        {/* Options Menu Modal */}
        <Modal
          transparent={true}
          visible={menuVisible}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleDeleteChat}
              >
                <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                <Text style={[styles.menuItemText, { color: "#FF6B6B" }]}>Delete Chat</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.chatContainer}
          keyboardVerticalOffset={keyboardOffset}
        >
          {/* Error handler */}
          <ErrorHandler 
            error={error} 
            onDismiss={() => setError(null)}
          />
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            inverted={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyListComponent}
            removeClippedSubviews={Platform.OS === 'android'}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            ListFooterComponent={status === 'streaming' || status === 'submitted' ? <TypingIndicator operation={currentOperation} /> : null}
          />
          
          <Animated.View 
            style={[
              styles.inputContainer,
              { opacity: fadeAnim }
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Message Solana Assistant..."
              placeholderTextColor={COLORS.darkText.tertiary}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={1000}
              editable={status !== 'submitted' && status !== 'streaming'}
            />
            {isLoading ? (
              <View style={styles.loadingButton}>
                <ActivityIndicator color={COLORS.white} />
              </View>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  (!connected || input.trim().length === 0 || status === 'submitted' || status === 'streaming') && styles.disabledButton
                ]}
                onPress={handleSendMessage}
                disabled={input.trim().length === 0 || status === 'submitted' || status === 'streaming' || !connected}
              >
                <LinearGradient
                  colors={[COLORS.brandPrimary, '#2AABB3']}
                  style={styles.sendButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="send" size={18} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.brandPrimaryAlpha.a10,
    top: -50,
    left: -50,
    opacity: 0.5,
  },
  decorCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(181, 145, 255, 0.04)',
    bottom: 100,
    right: -100,
  },
  glow1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: height * 0.3,
    left: -width * 0.2,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.darkText.primary,
    textShadowColor: COLORS.brandPrimaryAlpha.a50,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    maxWidth: width * 0.6,
  },
  walletWarning: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    flexGrow: 1,
    minHeight: '100%',
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '90%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  systemMessage: {
    alignSelf: 'flex-start',
  },
  structuredMessageContainer: {
    maxWidth: '95%',
    width: width * 0.95,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    minHeight: 40,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  structuredMessageBubble: {
    width: '100%',
    padding: 16,
  },
  lastUserMessage: {
    borderBottomRightRadius: 4, // Pointy edge on last user message
  },
  messageText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 22,
  },
  timestampText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  // Portfolio display styles
  portfolioContainer: {
    width: '100%',
  },
  solBalanceCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  solBalanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  solBalanceLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  solBalanceValue: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  tokensListContainer: {
    marginTop: 4,
    width: '100%',
  },
  tokenListTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  tokenCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  tokenCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
  },
  tokenNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  tokenName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  tokenSymbol: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginLeft: 4,
  },
  tokenBalanceContainer: {
    backgroundColor: 'rgba(50, 212, 222, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  tokenBalance: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  tokenAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  tokenAddressLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginRight: 4,
  },
  tokenAddress: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    flex: 1,
  },
  // ChatGPT-like typing indicator that appears in the message stream
  typingMessageBubble: {
    backgroundColor: '#2A2A2A', 
    padding: 16,
    borderRadius: 18,
    maxWidth: '100%',
    shadowColor: '#32D4DE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(50, 212, 222, 0.3)',
  },
  typingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    opacity: 0.9,
  },
  typingHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#32D4DE',
    marginLeft: 6,
  },
  typingIcon: {
    marginRight: 4,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingMessage: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 22,
    marginRight: 10,
  },
  typingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#32D4DE',
    marginHorizontal: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: COLORS.darkSurface.card,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(18, 18, 18, 0)',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 10,
    color: COLORS.darkText.primary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sendButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 212, 222, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.6,
    paddingHorizontal: 30,
  },
  emptyText: {
    color: COLORS.darkText.secondary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    color: COLORS.darkText.tertiary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  listContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  listBullet: {
    color: COLORS.brandPrimary,
    marginRight: 8,
    fontSize: 16,
  },
  listItemText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 22,
  },
  cryptoPriceContainer: {
    width: '100%',
  },
  cryptoPriceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cryptoPriceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cryptoPrice: {
    color: COLORS.brandPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 