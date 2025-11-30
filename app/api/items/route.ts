import { NextRequest, NextResponse } from 'next/server';

// Type definitions
interface ItemFormData {
  name: string;
  category: string;
  condition: string;
  pricePerDay: string;
  description: string;
  availableFrom: string;
  availableTo: string;
  meetingPoint: string;
  requiresCollateral: boolean;
  collateralAmount: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface SuccessResponse {
  success: true;
  itemId: string;
  data: ItemFormData & {
    createdAt: string;
    status: string;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  errors?: ValidationError[];
}

/**
 * Validate item form data
 */
function validateItemData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate name
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Item name is required' });
  } else if (data.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'Item name must be at least 3 characters' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Item name must not exceed 100 characters' });
  }

  // Validate category
  const validCategories = ['Books', 'Electronics', 'Furniture', 'Sports', 'Others'];
  if (!data.category || typeof data.category !== 'string') {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!validCategories.includes(data.category)) {
    errors.push({ 
      field: 'category', 
      message: `Category must be one of: ${validCategories.join(', ')}` 
    });
  }

  // Validate condition
  const validConditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  if (!data.condition || typeof data.condition !== 'string') {
    errors.push({ field: 'condition', message: 'Condition is required' });
  } else if (!validConditions.includes(data.condition)) {
    errors.push({ 
      field: 'condition', 
      message: `Condition must be one of: ${validConditions.join(', ')}` 
    });
  }

  // Validate pricePerDay
  if (!data.pricePerDay || typeof data.pricePerDay !== 'string') {
    errors.push({ field: 'pricePerDay', message: 'Price per day is required' });
  } else {
    const price = parseFloat(data.pricePerDay);
    if (isNaN(price) || price <= 0) {
      errors.push({ field: 'pricePerDay', message: 'Price per day must be a positive number' });
    } else if (price > 100000) {
      errors.push({ field: 'pricePerDay', message: 'Price per day must not exceed ₹100,000' });
    }
  }

  // Validate description
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
  } else if (data.description.trim().length > 1000) {
    errors.push({ field: 'description', message: 'Description must not exceed 1000 characters' });
  }

  // Validate availableFrom
  if (!data.availableFrom || typeof data.availableFrom !== 'string') {
    errors.push({ field: 'availableFrom', message: 'Available from date is required' });
  } else {
    const fromDate = new Date(data.availableFrom);
    if (isNaN(fromDate.getTime())) {
      errors.push({ field: 'availableFrom', message: 'Available from date is invalid' });
    }
  }

  // Validate availableTo
  if (!data.availableTo || typeof data.availableTo !== 'string') {
    errors.push({ field: 'availableTo', message: 'Available to date is required' });
  } else {
    const toDate = new Date(data.availableTo);
    if (isNaN(toDate.getTime())) {
      errors.push({ field: 'availableTo', message: 'Available to date is invalid' });
    } else if (data.availableFrom) {
      const fromDate = new Date(data.availableFrom);
      if (!isNaN(fromDate.getTime()) && toDate <= fromDate) {
        errors.push({ 
          field: 'availableTo', 
          message: 'Available to date must be after available from date' 
        });
      }
    }
  }

  // Validate meetingPoint
  if (!data.meetingPoint || typeof data.meetingPoint !== 'string' || data.meetingPoint.trim().length === 0) {
    errors.push({ field: 'meetingPoint', message: 'Meeting point is required' });
  } else if (data.meetingPoint.trim().length < 3) {
    errors.push({ field: 'meetingPoint', message: 'Meeting point must be at least 3 characters' });
  } else if (data.meetingPoint.trim().length > 200) {
    errors.push({ field: 'meetingPoint', message: 'Meeting point must not exceed 200 characters' });
  }

  // Validate requiresCollateral (boolean)
  if (typeof data.requiresCollateral !== 'boolean') {
    errors.push({ field: 'requiresCollateral', message: 'Requires collateral must be a boolean value' });
  }

  // Validate collateralAmount (if collateral is required)
  if (data.requiresCollateral === true) {
    if (!data.collateralAmount || typeof data.collateralAmount !== 'string') {
      errors.push({ field: 'collateralAmount', message: 'Collateral amount is required when collateral is enabled' });
    } else {
      const amount = parseFloat(data.collateralAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.push({ field: 'collateralAmount', message: 'Collateral amount must be a positive number' });
      } else if (amount > 1000000) {
        errors.push({ field: 'collateralAmount', message: 'Collateral amount must not exceed ₹10,00,000' });
      }
    }
  }

  return errors;
}

/**
 * Generate a unique item ID
 */
function generateItemId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `ITEM-${timestamp}-${randomPart}`;
}

/**
 * POST /api/items
 * Create a new item listing
 */
export async function POST(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Parse request body
    let body: any;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body'
        },
        { status: 400 }
      );
    }

    // Validate the data
    const validationErrors = validateItemData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationErrors
        },
        { status: 400 }
      );
    }

    // Type-safe data after validation
    const itemData: ItemFormData = {
      name: body.name.trim(),
      category: body.category,
      condition: body.condition,
      pricePerDay: body.pricePerDay,
      description: body.description.trim(),
      availableFrom: body.availableFrom,
      availableTo: body.availableTo,
      meetingPoint: body.meetingPoint.trim(),
      requiresCollateral: body.requiresCollateral,
      collateralAmount: body.collateralAmount
    };

    // Generate unique item ID
    const itemId = generateItemId();

    // In production, you would save to database here
    // Example:
    // const savedItem = await db.items.create({
    //   data: {
    //     ...itemData,
    //     userId: session.user.id,
    //     status: 'active'
    //   }
    // });

    // For now, simulate database save with delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Prepare response data
    const responseData = {
      ...itemData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // Log successful creation (in production, use proper logging)
    console.log(`[API] Item created successfully: ${itemId}`);
    console.log(`[API] Item data:`, responseData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        itemId,
        data: responseData
      },
      { status: 200 }
    );

  } catch (error: any) {
    // Log error (in production, use proper error logging service)
    console.error('[API] Error creating item:', error);

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while creating the item'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/items
 * Optional: Retrieve all items (for future use)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not implemented yet'
    },
    { status: 501 }
  );
}
