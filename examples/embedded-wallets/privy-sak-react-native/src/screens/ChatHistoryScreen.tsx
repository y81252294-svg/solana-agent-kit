import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Animated,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, ParamListBase, CommonActions, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/assets/colors';
import { fetchChats, deleteChat, bulkDeleteChats, deleteAllChats } from '@/lib/utils';
import { useWallet } from '@/walletProviders';

const { width, height } = Dimensions.get('window');

// Define route param types
type ChatHistoryParamList = {
  ChatHistory: {
    chatDeleted?: boolean;
    deletedChatId?: string;
    timestamp?: number;
  };
};

// Define chat history item interface
interface ChatHistoryItem {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Swipeable chat item component
const ChatItem = React.memo(({ 
  item, 
  onPress, 
  onDelete, 
  index,
  animationDelay,
  isEditMode,
  isSelected,
  onToggleSelect,
}: { 
  item: ChatHistoryItem;
  onPress: () => void;
  onDelete: () => void;
  index: number;
  animationDelay: number;
  isEditMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}) => {
  const itemOpacity = useRef(new Animated.Value(0)).current;
  const itemTranslate = useRef(new Animated.Value(50)).current;
  const itemScale = useRef(new Animated.Value(0.95)).current;
  
  // Format chat time
  const formatTime = (date: string): string => {
    const now = new Date();
    const chatDate = new Date(date);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Same day - show time
    if (chatDate >= today) {
      return chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Yesterday - show "Yesterday"
    else if (chatDate >= yesterday) {
      return 'Yesterday';
    }
    // Older - show date
    else {
      return chatDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Get initial letter for the avatar
  const getInitial = (title: string) => {
    return title.charAt(0).toUpperCase();
  };
  
  // Animate the chat item appearance with staggered delay
  useEffect(() => {
    const delay = animationDelay * Math.min(index, 10); // Staggered animation with max delay
    
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(itemOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(itemTranslate, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(itemScale, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true
        })
      ]).start();
    }, delay);
  }, []);
  
  // For edit mode, replace the normal press handler with selection toggle
  const handlePress = isEditMode ? onToggleSelect : onPress;
  
  // Swipe to delete functionality
  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        style={styles.deleteAction}
        onPress={onDelete}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };
  
  return (
    <Animated.View
      style={[
        styles.chatItemContainer,
        {
          opacity: itemOpacity,
          transform: [
            { translateY: itemTranslate },
            { scale: itemScale }
          ]
        }
      ]}
    >
      {isEditMode ? (
        <TouchableOpacity
          style={styles.chatItem}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#2A2A2A', '#303030']}
            style={styles.chatItemGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.chatItemContent}>
              <View style={styles.selectionContainer}>
                <View style={[
                  styles.checkbox, 
                  isSelected && styles.checkboxSelected
                ]}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </View>
              
              <LinearGradient
                colors={[COLORS.brandPrimary, '#32D4DE']}
                style={styles.chatItemAvatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.chatItemAvatarText}>
                  {getInitial(item.title)}
                </Text>
              </LinearGradient>
              
              <View style={styles.chatItemDetails}>
                <View style={styles.chatItemHeader}>
                  <Text style={styles.chatItemTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                  <Text style={styles.chatItemTime}>
                    {formatTime(item.updatedAt || item.createdAt)}
                  </Text>
                </View>
                <Text style={styles.chatItemPreview} numberOfLines={1} ellipsizeMode="tail">
                  Tap to continue your Solana conversation
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <Swipeable
          renderRightActions={renderRightActions}
          overshootRight={false}
          friction={2}
          rightThreshold={width * 0.3}
        >
          <TouchableOpacity
            style={styles.chatItem}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#2A2A2A', '#303030']}
              style={styles.chatItemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.chatItemContent}>
                <LinearGradient
                  colors={[COLORS.brandPrimary, '#32D4DE']}
                  style={styles.chatItemAvatar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.chatItemAvatarText}>
                    {getInitial(item.title)}
                  </Text>
                </LinearGradient>
                
                <View style={styles.chatItemDetails}>
                  <View style={styles.chatItemHeader}>
                    <Text style={styles.chatItemTitle} numberOfLines={1} ellipsizeMode="tail">
                      {item.title}
                    </Text>
                    <Text style={styles.chatItemTime}>
                      {formatTime(item.updatedAt || item.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.chatItemPreview} numberOfLines={1} ellipsizeMode="tail">
                    Tap to continue your Solana conversation
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Swipeable>
      )}
    </Animated.View>
  );
});

export default function ChatHistoryScreen() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const route = useRoute();
  const [chats, setChats] = useState<ChatHistoryItem[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const { connected, address, publicKey } = useWallet();
  const walletAddress = address || publicKey?.toString();
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  
  // Check for deletion params from ChatScreen
  useEffect(() => {
    const params = route.params as ChatHistoryParamList['ChatHistory'] | undefined;
    if (params?.chatDeleted && params?.deletedChatId) {
      // Remove the deleted chat from state if it exists in our list
      const deletedId = params.deletedChatId;
      setChats(prev => prev.filter(chat => chat.id !== deletedId));
      setFilteredChats(prev => prev.filter(chat => chat.id !== deletedId));
      
      // Clear params after handling
      navigation.setParams({ 
        chatDeleted: undefined, 
        deletedChatId: undefined, 
        timestamp: undefined 
      });
    }
  }, [route.params, navigation]);
  
  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Load chats
  const loadChats = useCallback(async (showLoadingIndicator = true) => {
    if (!connected || !walletAddress) {
      setError("Wallet not connected");
      setLoading(false);
      return;
    }
    
    try {
      if (showLoadingIndicator) {
        setLoading(true);
      }
      setError(null);
      const fetchedChats = await fetchChats(20, null, null, walletAddress);
      
      setChats(fetchedChats);
      setFilteredChats(fetchedChats);
      
      // Clear selection when reloading
      setSelectedChats(new Set());
      
    } catch (err) {
      console.error('Error loading chats:', err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [connected, walletAddress]);
  
  // Initial load
  useEffect(() => {
    loadChats();
  }, [loadChats]);
  
  // Navigate to chat detail - updated to use CommonActions for parent stack navigation
  const navigateToChat = useCallback((chatId: string, title: string) => {
    // Using CommonActions to ensure we navigate to the Chat screen in the parent stack
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Chat',
        params: { id: chatId, title },
      })
    );
  }, [navigation]);
  
  // Start new chat - also navigate to the parent stack's Chat screen
  const startNewChat = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Chat',
      })
    );
  }, [navigation]);
  
  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
    setSelectedChats(new Set());
  }, []);
  
  // Toggle chat selection
  const toggleChatSelection = useCallback((chatId: string) => {
    setSelectedChats(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(chatId)) {
        newSelected.delete(chatId);
      } else {
        newSelected.add(chatId);
      }
      return newSelected;
    });
  }, []);
  
  // Bulk delete selected chats
  const deleteSelectedChats = useCallback(() => {
    const selectedIds = Array.from(selectedChats);
    
    if (selectedIds.length === 0) {
      return;
    }
    
    Alert.alert(
      "Delete Chats",
      `Are you sure you want to delete ${selectedIds.length} chat${selectedIds.length > 1 ? 's' : ''}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await bulkDeleteChats(selectedIds, walletAddress);
              
              if (result.success) {
                // Remove deleted chats from state
                const deletedSet = new Set(result.deletedChats);
                
                setChats(prev => prev.filter(chat => !deletedSet.has(chat.id)));
                setFilteredChats(prev => prev.filter(chat => !deletedSet.has(chat.id)));
                
                // Exit edit mode
                setIsEditMode(false);
                setSelectedChats(new Set());
              } else {
                Alert.alert("Error", "Failed to delete chats");
              }
            } catch (error) {
              console.error("Bulk delete error:", error);
              Alert.alert("Error", "Failed to delete chats");
            }
          }
        }
      ]
    );
  }, [selectedChats, walletAddress]);
  
  // Pull to refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadChats(false);
  }, [loadChats]);
  
  // Delete chat handler - immediately update UI when a chat is deleted
  const handleDeleteChat = useCallback((chatId: string) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteChat(chatId, walletAddress);
              if (success) {
                // Remove from state if successfully deleted on the server
                setChats(prev => prev.filter(chat => chat.id !== chatId));
                setFilteredChats(prev => prev.filter(chat => chat.id !== chatId));
              } else {
                Alert.alert("Error", "Failed to delete chat");
              }
            } catch (error) {
              console.error("Delete chat error:", error);
              Alert.alert("Error", "Failed to delete chat");
            }
          }
        }
      ]
    );
  }, [walletAddress]);
  
  // Focus effect to refresh chats when navigating back to this screen
  useFocusEffect(
    React.useCallback(() => {
      // Only refresh if not in loading or refreshing state
      if (!loading && !refreshing) {
        loadChats(false);
      }
      
      return () => {
        // Clean up if needed
      };
    }, [loadChats, loading, refreshing])
  );

  // Handle search
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredChats(chats);
      return;
    }
    
    const filtered = chats.filter(chat => 
      chat.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [chats]);
  
  // Select all chats
  const selectAllChats = useCallback(() => {
    if (filteredChats.length === selectedChats.size) {
      // If all are selected, deselect all
      setSelectedChats(new Set());
    } else {
      // Otherwise select all
      setSelectedChats(new Set(filteredChats.map(chat => chat.id)));
    }
  }, [filteredChats, selectedChats]);
  
  // Memoized empty component
  const EmptyComponent = useMemo(() => {
    if (loading) return null;
    
    if (searchText && filteredChats.length === 0) {
      return (
        <Animated.View 
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Ionicons name="search" size={60} color={COLORS.darkText.tertiary} />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </Animated.View>
      );
    }
    
    if (chats.length === 0) {
      return (
        <Animated.View 
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Ionicons name="chatbubbles-outline" size={70} color={COLORS.darkText.tertiary} />
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubtext}>Start a new conversation with Solana AI</Text>
          <TouchableOpacity 
            style={styles.startChatButton}
            onPress={startNewChat}
          >
            <LinearGradient
              colors={[COLORS.brandPrimary, '#2AABB3']}
              style={styles.startChatGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.startChatButtonText}>Start New Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    return null;
  }, [loading, chats.length, filteredChats.length, searchText, startNewChat, fadeAnim, slideAnim, scaleAnim]);
  
  // Render each chat item
  const renderChatItem = useCallback(({ item, index }: { item: ChatHistoryItem, index: number }) => (
    <ChatItem
      item={item}
      onPress={() => navigateToChat(item.id, item.title)}
      onDelete={() => handleDeleteChat(item.id)}
      index={index}
      animationDelay={50}
      isEditMode={isEditMode}
      isSelected={selectedChats.has(item.id)}
      onToggleSelect={() => toggleChatSelection(item.id)}
    />
  ), [navigateToChat, handleDeleteChat, isEditMode, selectedChats, toggleChatSelection]);
  
  // Loading spinner for the center of the screen
  const renderLoading = useCallback(() => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandPrimary} />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }, [loading]);
  
  // Connect Wallet button for when the wallet is not connected
  const renderConnectWallet = useCallback(() => {
    if (connected || !error || error !== "Wallet not connected") return null;
    
    return (
      <Animated.View 
        style={[
          styles.connectWalletContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Ionicons name="wallet-outline" size={70} color={COLORS.darkText.tertiary} />
        <Text style={styles.emptyText}>Wallet not connected</Text>
        <Text style={styles.emptySubtext}>Please connect your wallet to see your chat history</Text>
      </Animated.View>
    );
  }, [connected, error, fadeAnim, slideAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      
      <LinearGradient
        colors={['#1A1A1A', '#121212', '#050505']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative elements */}
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
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Text style={styles.title}>Chat History</Text>
          
          {chats.length > 0 && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={toggleEditMode}
            >
              <Text style={styles.editButtonText}>
                {isEditMode ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Edit mode actions bar */}
        {isEditMode && (
          <Animated.View 
            style={[
              styles.editActionsBar,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.editActionsLeft}>
              <TouchableOpacity 
                style={styles.selectAllButton}
                onPress={selectAllChats}
              >
                <Text style={styles.selectAllText}>
                  {selectedChats.size === filteredChats.length ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.deleteSelectedButton,
                selectedChats.size === 0 && styles.disabledButton
              ]}
              onPress={deleteSelectedChats}
              disabled={selectedChats.size === 0}
            >
              <Text style={styles.deleteSelectedText}>
                Delete ({selectedChats.size})
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        {/* Search Bar */}
        <Animated.View 
          style={[
            styles.searchContainer,
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.darkText.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={COLORS.darkText.tertiary}
              value={searchText}
              onChangeText={handleSearch}
            />
            {searchText ? (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.darkText.tertiary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
        
        {renderLoading()}
        {renderConnectWallet()}
        
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.chatListContainer,
            (filteredChats.length === 0) && styles.chatListEmpty
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyComponent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
        
        {!isEditMode && (
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={startNewChat}
          >
            <LinearGradient
              colors={[COLORS.brandPrimary, '#2AABB3']}
              style={styles.newChatButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add" size={26} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
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
    top: height * 0.2,
    right: -width * 0.25,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkText.primary,
    textShadowColor: COLORS.brandPrimaryAlpha.a50,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  editButtonText: {
    color: COLORS.brandPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  editActionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  editActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectAllText: {
    color: COLORS.darkText.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  deleteAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteAllText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteSelectedButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
  },
  deleteSelectedText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 45,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    color: COLORS.darkText.primary,
    marginLeft: 8,
    fontSize: 16,
  },
  chatListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Make room for the new chat button
  },
  chatListEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  chatItemContainer: {
    marginBottom: 12,
  },
  chatItem: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  chatItemGradient: {
    width: '100%',
    padding: 14,
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatItemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chatItemAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  chatItemDetails: {
    flex: 1,
  },
  chatItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText.primary,
    maxWidth: width * 0.55,
  },
  chatItemTime: {
    fontSize: 12,
    color: COLORS.darkText.tertiary,
  },
  chatItemPreview: {
    fontSize: 14,
    color: COLORS.darkText.tertiary,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
    zIndex: 10,
  },
  loadingText: {
    color: COLORS.darkText.secondary,
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  emptyText: {
    color: COLORS.darkText.secondary,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.darkText.tertiary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  connectWalletContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 5,
  },
  startChatButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startChatGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startChatButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  newChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: COLORS.brandPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newChatButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAction: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  selectionContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.darkText.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
}); 