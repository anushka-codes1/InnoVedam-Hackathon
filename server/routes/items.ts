/**
 * Items API Routes
 * Create, read, update, delete items
 */

import {
  supabase,
  createItem,
  getAvailableItems,
  getItemById,
  Item,
} from '../../lib/supabase';
import { autoSuggestPrice, validatePrice, checkPriceAbuse } from '../../utils/pricing';

export interface CreateItemRequest {
  ownerId: string;
  title: string;
  description?: string;
  category: string;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  availableQuantity: number;
  images?: string[];
  pickupLocation?: string;
  campusBuilding?: string;
  allowsSelfDelivery: boolean;
  allowsBuddyDelivery: boolean;
  allowsPriorityDelivery: boolean;
  customPrice?: number;
  estimatedValue?: number;
}

/**
 * Create new item listing with smart pricing
 */
export const createItemListing = async (request: CreateItemRequest) => {
  try {
    // Auto-suggest price based on category and condition
    const priceSuggestion = autoSuggestPrice(
      request.category,
      24, // Default 24 hours for suggestion
      request.condition
    );

    // Use custom price if provided, otherwise use suggested
    const agreedPrice = request.customPrice || priceSuggestion.suggestedPrice;

    // Validate price is within bounds
    const priceValidation = validatePrice(agreedPrice, request.category);
    if (!priceValidation.valid) {
      return {
        success: false,
        error: priceValidation.message,
      };
    }

    // Check for potential price abuse
    const abuseCheck = checkPriceAbuse(
      agreedPrice,
      priceSuggestion.suggestedPrice,
      request.category
    );

    if (abuseCheck.severity === 'severe') {
      return {
        success: false,
        error: abuseCheck.message,
        warning: 'Price appears to be exploitative. Please review pricing guidelines.',
      };
    }

    // Determine if collateral is required (high-value items)
    const estimatedValue = request.estimatedValue || agreedPrice * 10;
    const requiresCollateral = estimatedValue > 1000;
    const collateralAmount = requiresCollateral ? estimatedValue * 0.3 : 0;

    // Create item
    const item = await createItem({
      owner_id: request.ownerId,
      title: request.title,
      description: request.description,
      category: request.category,
      base_price: priceSuggestion.basePrice,
      min_price: priceSuggestion.minPrice,
      max_price: priceSuggestion.maxPrice,
      suggested_price: priceSuggestion.suggestedPrice,
      requires_collateral: requiresCollateral,
      collateral_amount: collateralAmount,
      is_high_value: estimatedValue > 2000,
      condition: request.condition,
      available_quantity: request.availableQuantity,
      images: request.images,
      allows_self_delivery: request.allowsSelfDelivery,
      allows_buddy_delivery: request.allowsBuddyDelivery,
      allows_priority_delivery: request.allowsPriorityDelivery,
      pickup_location: request.pickupLocation,
      campus_building: request.campusBuilding,
      is_available: true,
    });

    return {
      success: true,
      item,
      priceSuggestion,
      warning: abuseCheck.severity !== 'none' ? abuseCheck.message : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all available items with filters
 */
export const getItems = async (filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  campus_building?: string;
  search?: string;
}) => {
  try {
    let query = supabase
      .from('items')
      .select('*, users:owner_id(*)')
      .eq('is_available', true);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('suggested_price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('suggested_price', filters.maxPrice);
    }

    if (filters?.campus_building) {
      query = query.eq('campus_building', filters.campus_building);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      items: data,
      count: data?.length || 0,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get item by ID
 */
export const getItem = async (itemId: string) => {
  try {
    const item = await getItemById(itemId);

    return {
      success: true,
      item,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update item
 */
export const updateItem = async (itemId: string, updates: Partial<Item>) => {
  try {
    // If price is being updated, validate it
    if (updates.suggested_price) {
      const item = await getItemById(itemId);
      const priceValidation = validatePrice(updates.suggested_price, item.category);
      
      if (!priceValidation.valid) {
        return {
          success: false,
          error: priceValidation.message,
        };
      }
    }

    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      item: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete item
 */
export const deleteItem = async (itemId: string, ownerId: string) => {
  try {
    // Verify ownership
    const item = await getItemById(itemId);
    if (item.owner_id !== ownerId) {
      return {
        success: false,
        error: 'You are not authorized to delete this item',
      };
    }

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return {
      success: true,
      message: 'Item deleted successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get user's items
 */
export const getUserItems = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      items: data,
      count: data?.length || 0,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Toggle item availability
 */
export const toggleItemAvailability = async (
  itemId: string,
  ownerId: string,
  isAvailable: boolean
) => {
  try {
    // Verify ownership
    const item = await getItemById(itemId);
    if (item.owner_id !== ownerId) {
      return {
        success: false,
        error: 'You are not authorized to modify this item',
      };
    }

    const { data, error } = await supabase
      .from('items')
      .update({ is_available: isAvailable })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      item: data,
      message: `Item ${isAvailable ? 'made available' : 'marked unavailable'}`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
