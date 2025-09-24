import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/clerk-react";

// Global flags and safe auth wrapper
const IS_CLERK_CONFIGURED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'pk_test_demo_key_for_development';
const ENABLE_CONVEX = import.meta.env.VITE_ENABLE_CONVEX === 'true';
const useSafeAuth = () => {
  if (!IS_CLERK_CONFIGURED) {
    return { userId: undefined } as { userId: string | undefined };
  }
  return useAuth();
};

// Thin helpers to bypass strict Convex types while using string identifiers
const useConvexQuery = (name: string, args: any) => (useQuery as unknown as (n: string, a: any) => any)(name, args);
const useConvexMutation = (name: string) => (useMutation as unknown as (n: string) => any)(name);

// Custom hook for getting current user
export const useCurrentUser = () => {
  const { userId } = useSafeAuth();
  // If Convex is disabled, return undefined to indicate no remote user
  if (!ENABLE_CONVEX) return undefined as any;
  // Temporary fix: Use test user if no Clerk userId
  const testUserId = userId || "test-user-123";
  const user = useConvexQuery("myFunctions:getUserProfile", testUserId ? { clerkId: testUserId } : "skip");
  return user as any;
};

// Custom hook for medicines
export const useMedicines = (category?: string, search?: string) => {
  if (!ENABLE_CONVEX) return undefined as any;
  return useConvexQuery("myFunctions:getMedicines", { category, search });
};

// Custom hook for cart
export const useCart = () => {
  const { userId } = useSafeAuth();
  const user = useCurrentUser();
  // Temporary fix: Use test user ID if no authenticated user
  const effectiveUserId = (user as any)?._id || "kd76tt2k295wp3r6r46r6acxv17pqxy0";
  console.log("useCart Debug:", { userId, user, effectiveUserId });
  const cartItems = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getCartItems", effectiveUserId ? { userId: effectiveUserId } : "skip")
    : undefined;
  const addToCart = ENABLE_CONVEX ? useConvexMutation("myFunctions:addToCart") : null as any;
  const updateCartItem = ENABLE_CONVEX ? useConvexMutation("myFunctions:updateCartItem") : null as any;
  const removeFromCart = ENABLE_CONVEX ? useConvexMutation("myFunctions:removeFromCart") : null as any;

  const addItemToCart = async (medicineId: string, quantity: number) => {
    if (!ENABLE_CONVEX || !effectiveUserId || !addToCart) return;
    await addToCart({ userId: effectiveUserId, medicineId, quantity } as any);
  };
  
  const updateItemQuantity = async (cartItemId: string, quantity: number) => {
    if (!ENABLE_CONVEX || !updateCartItem) return;
    await updateCartItem({ cartItemId, quantity } as any);
  };
  
  const removeItemFromCart = async (cartItemId: string) => {
    if (!ENABLE_CONVEX || !removeFromCart) return;
    await removeFromCart({ cartItemId } as any);
  };
  
  return {
    cartItems,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    isLoading: user === undefined,
    userLoaded: !!effectiveUserId,
  };
};

// Custom hook for reminders
export const useReminders = (activeOnly = true) => {
  const { userId } = useSafeAuth();
  const user = useCurrentUser();
  const reminders = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getReminders", user?._id ? { userId: user._id, activeOnly } : "skip")
    : undefined;
  const createReminder = ENABLE_CONVEX ? useConvexMutation("myFunctions:createReminder") : null as any;
  const updateReminder = ENABLE_CONVEX ? useConvexMutation("myFunctions:updateReminder") : null as any;
  const deleteReminder = ENABLE_CONVEX ? useConvexMutation("myFunctions:deleteReminder") : null as any;
  
  const addReminder = async (reminderData: {
    type: "medication" | "appointment" | "lab_test";
    title: string;
    description: string;
    scheduledTime: number;
    repeatPattern?: string;
    medicineId?: string;
    dosage?: string;
    doctorId?: string;
    labTestId?: string;
  }) => {
    if (!ENABLE_CONVEX || !user?._id || !createReminder) return;
    await createReminder({ userId: user._id, ...reminderData });
  };
  
  const updateReminderItem = async (reminderId: string, updates: any) => {
    if (!ENABLE_CONVEX || !updateReminder) return;
    await updateReminder({ reminderId, updates });
  };
  
  const deleteReminderItem = async (reminderId: string) => {
    if (!ENABLE_CONVEX || !deleteReminder) return;
    await deleteReminder({ reminderId });
  };
  
  return {
    reminders,
    addReminder,
    updateReminderItem,
    deleteReminderItem,
  };
};

// Custom hook for lab tests
export const useLabTests = () => {
  const { userId } = useSafeAuth();
  const user = useCurrentUser();
  const labTests = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getLabTests", user?._id ? { userId: user._id } : "skip")
    : undefined;
  const createLabTest = ENABLE_CONVEX ? useConvexMutation("myFunctions:createLabTest") : null as any;
  const updateLabTest = ENABLE_CONVEX ? useConvexMutation("myFunctions:updateLabTest") : null as any;
  
  const addLabTest = async (labTestData: {
    testName: string;
    testType: string;
    scheduledDate: number;
    labName?: string;
    labAddress?: string;
    fastingRequired?: boolean;
    instructions?: string;
  }) => {
    if (!ENABLE_CONVEX || !user?._id || !createLabTest) return;
    await createLabTest({ userId: user._id, ...labTestData });
  };
  
  const updateLabTestItem = async (labTestId: string, updates: any) => {
    if (!ENABLE_CONVEX || !updateLabTest) return;
    await updateLabTest({ labTestId, updates });
  };
  
  return {
    labTests,
    addLabTest,
    updateLabTestItem,
  };
};

// Custom hook for doctors
export const useDoctors = (specialization?: string, location?: string) => {
  if (!ENABLE_CONVEX) return undefined as any;
  return useConvexQuery("myFunctions:getDoctors", { specialization, location });
};

// Custom hook for clinical documents
export const useClinicalDocs = () => {
  const { userId } = useSafeAuth();
  const user = useCurrentUser();
  
  console.log("useClinicalDocs - userId:", userId);
  console.log("useClinicalDocs - user:", user);
  console.log("useClinicalDocs - user?._id:", user?._id);
  
  const clinicalDocs = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getClinicalDocs", user?._id ? { userId: user._id } : "skip")
    : undefined;
  const clinicalDocsStats = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getClinicalDocStats", user?._id ? { userId: user._id } : "skip")
    : undefined;
  const getClinicalDocById = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getClinicalDocById", "skip")
    : undefined;
  const createClinicalDoc = ENABLE_CONVEX ? useConvexMutation("myFunctions:createClinicalDoc") : null as any;
  const updateClinicalDoc = ENABLE_CONVEX ? useConvexMutation("myFunctions:updateClinicalDoc") : null as any;
  const deleteClinicalDoc = ENABLE_CONVEX ? useConvexMutation("myFunctions:deleteClinicalDoc") : null as any;
  
  const addClinicalDoc = async (docData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    attachments?: string[];
    doctorId?: string;
    isPrivate: boolean;
  }) => {
    console.log("addClinicalDoc called with:", docData);
    console.log("Current user ID:", user?._id);
    
    if (!ENABLE_CONVEX || !user?._id || !createClinicalDoc) {
      console.error("Cannot create clinical document: User not authenticated or loaded");
      throw new Error("User not authenticated. Please log in to create clinical documents.");
    }
    
    try {
      console.log("Creating clinical document with userId:", user._id);
      const result = await createClinicalDoc({ userId: user._id, ...docData });
      console.log("Clinical document created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error creating clinical document:", error);
      throw error;
    }
  };
  
  const updateDoc = async (docId: string, updates: any) => {
    try {
      // Check if this is a local document
      if (String(docId).startsWith('local-')) {
        // For local documents, we'll let the calling component handle the update
        // This allows the component to update its local state
        throw new Error('Local document - update handled by component');
      }
      
      // For remote documents, call the Convex mutation
      if (!ENABLE_CONVEX || !updateClinicalDoc) return;
      await updateClinicalDoc({ docId, updates });
    } catch (error) {
      console.error("Error updating clinical document:", error);
      throw error;
    }
  };
  
  const deleteDoc = async (docId: string) => {
    try {
      // Check if this is a local document
      if (String(docId).startsWith('local-')) {
        // For local documents, we'll let the calling component handle the deletion
        // This allows the component to update its local state
        throw new Error('Local document - deletion handled by component');
      }
      
      // For remote documents, call the Convex mutation
      if (!ENABLE_CONVEX || !deleteClinicalDoc) return;
      await deleteClinicalDoc({ docId });
    } catch (error) {
      console.error("Error deleting clinical document:", error);
      throw error;
    }
  };
  
  return {
    clinicalDocs,
    clinicalDocsStats,
    addClinicalDoc,
    updateDoc,
    deleteDoc,
    isUserLoaded: !!user?._id,
    currentUser: user,
  };
};

// Custom hook for AI conversations
export const useConversation = () => {
  const { userId } = useSafeAuth();
  const user = useCurrentUser();
  const conversation = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getConversation", user?._id ? { userId: user._id } : "skip")
    : undefined;
  const createConversation = ENABLE_CONVEX ? useConvexMutation("myFunctions:createConversation") : null as any;
  const addMessage = ENABLE_CONVEX ? useConvexMutation("myFunctions:addMessage") : null as any;
  
  const startConversation = async () => {
    if (!ENABLE_CONVEX || !user?._id || !createConversation) return;
    await createConversation({ userId: user._id });
  };
  
  const sendMessage = async (content: string, metadata?: any) => {
    if (!ENABLE_CONVEX || !conversation?._id || !addMessage) return;
    await addMessage({
      conversationId: conversation._id,
      role: "user",
      content,
      metadata,
    });
  };
  
  return {
    conversation,
    startConversation,
    sendMessage,
  };
};

// Custom hook for appointments
export const useAppointments = () => {
  const { userId } = useSafeAuth();
  const user = useCurrentUser();
  const appointments = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getAppointments", user?._id ? { userId: user._id } : "skip")
    : undefined;
  const createAppointment = ENABLE_CONVEX ? useConvexMutation("myFunctions:createAppointment") : null as any;
  const updateAppointment = ENABLE_CONVEX ? useConvexMutation("myFunctions:updateAppointment") : null as any;
  
  const bookAppointment = async (appointmentData: {
    doctorId: string;
    scheduledTime: number;
    type: "consultation" | "follow_up" | "emergency";
    notes?: string;
    symptoms?: string[];
  }) => {
    if (!ENABLE_CONVEX || !user?._id || !createAppointment) return;
    await createAppointment({ userId: user._id, ...appointmentData });
  };
  
  const updateAppointmentItem = async (appointmentId: string, updates: any) => {
    if (!ENABLE_CONVEX || !updateAppointment) return;
    await updateAppointment({ appointmentId, updates });
  };
  
  return {
    appointments,
    bookAppointment,
    updateAppointmentItem,
  };
};

// Custom hook for orders
export const useOrders = () => {
  const { userId } = useSafeAuth();
  const user = useCurrentUser();
  const orders = ENABLE_CONVEX
    ? useConvexQuery("myFunctions:getOrders", user?._id ? { userId: user._id } : "skip")
    : undefined;
  const createOrder = ENABLE_CONVEX ? useConvexMutation("myFunctions:createOrder") : null as any;
  
  const placeOrder = async (orderData: {
    items: Array<{
      medicineId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }) => {
    if (!ENABLE_CONVEX || !user?._id || !createOrder) return;
    await createOrder({ userId: user._id, ...orderData });
  };
  
  return {
    orders,
    placeOrder,
  };
};
