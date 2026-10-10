//import component React Native
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from 'react-native';

//import hook useState & useEffect
import React, {useState, useEffect} from 'react';

//import api
import Api from '../../services/api';

//import BACKEND_API_URL from .env file
import {BACKEND_API_URL} from '@env';

export default function PostIndex({navigation}) {
  //init state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  //method fetchDataPosts
  const fetchDataPosts = async () => {
    //set loading true
    setLoading(true);

    await Api.get('/api/posts').then(response => {
      //assign data to state
      setPosts(response.data.data);

      //set loading false
      setLoading(false);
    });
  };

  //hook useEffect
  useEffect(() => {
    //call method "fetchDataPosts"
    fetchDataPosts();
  }, []);

  //method deletePost
  const deletePost = async id => {
    //delete with api
    await Api.delete(`/api/posts/${id}`).then(() => {
      //call method "fetchDataPosts"
      fetchDataPosts();
      //show toast
      ToastAndroid.show('Post Deleted Successfully!', ToastAndroid.LONG);
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDataPosts} />
        }>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>MY JOURNAL</Text>
            <Text style={styles.text}>Temukan inspirasimu</Text>
            <Text style={styles.subtitle}>
              Kelola semua cerita dan ide dalam satu tempat.
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>RN</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>TOTAL POSTS</Text>
            <Text style={styles.summaryNumber}>{posts.length}</Text>
          </View>
          <Text style={styles.summaryDecoration}>✦</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Postingan terbaru</Text>
          <Text style={styles.sectionCount}>{posts.length} item</Text>
        </View>

        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#0f766e" />
            <Text style={styles.stateText}>Memuat postingan...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>✦</Text>
            <Text style={styles.emptyTitle}>Belum ada postingan</Text>
            <Text style={styles.emptyText}>
              Mulai tulis cerita pertamamu dan biarkan idemu berkembang.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.push('PostCreate')}>
              <Text style={styles.emptyButtonText}>Buat postingan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          posts.map((post, index) => (
            <View key={index} style={styles.postCard}>
              <Image
                source={{
                  uri: `${BACKEND_API_URL}/uploads/${post.image}`,
                }}
                style={styles.postImage}
              />
              <View style={styles.postDetails}>
                <Text style={styles.postNumber}>POST {String(index + 1).padStart(2, '0')}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {post.title}
                </Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.push('PostEdit', {id: post.id})}
                    style={styles.editButton}
                    activeOpacity={0.8}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deletePost(post.id)}
                    activeOpacity={0.8}>
                    <Text style={styles.deleteButtonText}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.push('PostCreate')}
        activeOpacity={0.85}>
        <Text style={styles.floatingButtonText}>+</Text>
        <Text style={styles.floatingButtonLabel}>Tulis</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f7',
  },
  scrollContent: {
    padding: 22,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  eyebrow: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 7,
  },
  text: {
    fontSize: 27,
    fontWeight: '800',
    color: '#12343b',
  },
  subtitle: {
    color: '#718096',
    fontSize: 13,
    marginTop: 7,
    maxWidth: 255,
    lineHeight: 19,
  },
  headerBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#d7f0ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#0f766e',
    fontWeight: '800',
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#12343b',
    borderRadius: 22,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    shadowColor: '#12343b',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  summaryLabel: {
    color: '#9fd7d0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  summaryNumber: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 5,
  },
  summaryDecoration: {
    color: '#8ed1c9',
    fontSize: 52,
    fontWeight: '200',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#12343b',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCount: {
    color: '#84959a',
    fontSize: 12,
    fontWeight: '600',
  },
  postCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#12343b',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  postImage: {
    width: 92,
    height: 108,
    borderRadius: 13,
    backgroundColor: '#dce8e8',
  },
  postDetails: {
    flex: 1,
    paddingLeft: 14,
    paddingVertical: 3,
  },
  postNumber: {
    color: '#0f766e',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    color: '#243b40',
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#e5f4f1',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 13,
    marginRight: 8,
  },
  editButtonText: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '800',
  },
  deleteButton: {
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  deleteButtonText: {
    color: '#d66b6b',
    fontSize: 12,
    fontWeight: '700',
  },
  stateContainer: {
    alignItems: 'center',
    paddingVertical: 45,
  },
  stateText: {
    color: '#718096',
    marginTop: 12,
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    padding: 28,
  },
  emptyIcon: {
    color: '#0f766e',
    fontSize: 30,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#12343b',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: '#718096',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  emptyButton: {
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f766e',
    elevation: 7,
    shadowColor: '#0f766e',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  floatingButtonText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: '300',
    marginRight: 6,
  },
  floatingButtonLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
});
