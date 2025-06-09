import { 
  // Auth functions
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

import {
  // Firestore functions
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';

import {
  // Storage functions
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';

import { auth, db, storage } from './firebase';

// ==================== AUTHENTICATION UTILITIES ====================

// Sign in with email and password
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create new user with email and password
export const createUser = async (email, password, displayName = null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== FIRESTORE UTILITIES ====================

// Add a document to a collection
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get a single document by ID
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Document not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all documents from a collection
export const getDocuments = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply conditions if provided
    if (conditions.length > 0) {
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to real-time updates for a collection
export const onCollectionSnapshot = (collectionName, callback, conditions = []) => {
  let q = collection(db, collectionName);
  
  if (conditions.length > 0) {
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    callback(documents);
  });
};

// ==================== STORAGE UTILITIES ====================

// Upload a file to Firebase Storage
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL, path: snapshot.ref.fullPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get download URL for a file
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a file from storage
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// List all files in a directory
export const listFiles = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const files = [];
    for (const itemRef of result.items) {
      const url = await getDownloadURL(itemRef);
      files.push({
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        url
      });
    }
    
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== E-WAITER SPECIFIC UTILITIES ====================

// Restaurant management functions
export const addRestaurant = async (restaurantData) => {
  return await addDocument('restaurants', restaurantData);
};

export const getRestaurants = async () => {
  return await getDocuments('restaurants');
};

export const updateRestaurant = async (restaurantId, data) => {
  return await updateDocument('restaurants', restaurantId, data);
};

export const deleteRestaurant = async (restaurantId) => {
  return await deleteDocument('restaurants', restaurantId);
};

// Menu management functions
export const addMenuItem = async (menuData) => {
  return await addDocument('menu', menuData);
};

export const getMenuItems = async (restaurantId = null) => {
  const conditions = restaurantId ? [{ field: 'restaurantId', operator: '==', value: restaurantId }] : [];
  return await getDocuments('menu', conditions);
};

export const updateMenuItem = async (itemId, data) => {
  return await updateDocument('menu', itemId, data);
};

export const deleteMenuItem = async (itemId) => {
  return await deleteDocument('menu', itemId);
};

// Order management functions
export const addOrder = async (orderData) => {
  return await addDocument('orders', orderData);
};

export const getOrders = async (status = null) => {
  const conditions = status ? [{ field: 'status', operator: '==', value: status }] : [];
  return await getDocuments('orders', conditions);
};

export const updateOrderStatus = async (orderId, status) => {
  return await updateDocument('orders', orderId, { status });
};

// Upload restaurant/menu images
export const uploadRestaurantImage = async (file, restaurantId) => {
  const path = `restaurants/${restaurantId}/images/${file.name}`;
  return await uploadFile(file, path);
};

export const uploadMenuItemImage = async (file, itemId) => {
  const path = `menu/${itemId}/images/${file.name}`;
  return await uploadFile(file, path);
}; 