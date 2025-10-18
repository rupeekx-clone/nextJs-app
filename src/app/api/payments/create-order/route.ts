import { NextRequest, NextResponse } from 'next/server';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import { validateData, z } from '@/lib/validation';
import MembershipCardType from '@/models/MembershipCardType';
import CashLendingSubscriptionPlan from '@/models/CashLendingSubscriptionPlan';
import { RazorpayService } from '@/lib/razorpay';

const createOrderSchema = z.object({
  type: z.enum(['membership_card', 'cash_lending_subscription']),
  item_id: z.string().min(1, 'Item ID is required'),
});

const createOrderHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    const body = await req.json();

    // Validate the request body
    const validation = validateData(createOrderSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    const validatedData = validation.data as any;
    let amount = 0;
    let itemName = '';

    if (validatedData.type === 'membership_card') {
      // Find the membership card type
      const cardType = await MembershipCardType.findOne({
        card_type_id: validatedData.item_id,
        is_active: true
      });

      if (!cardType) {
        return NextResponse.json({
          error: 'Membership card type not found or not active'
        }, { status: 404 });
      }

      amount = cardType.price;
      itemName = cardType.name;
    } else if (validatedData.type === 'cash_lending_subscription') {
      // Find the subscription plan
      const plan = await CashLendingSubscriptionPlan.findOne({
        plan_id: validatedData.item_id,
        is_active: true
      });

      if (!plan) {
        return NextResponse.json({
          error: 'Subscription plan not found or not active'
        }, { status: 404 });
      }

      amount = plan.price;
      itemName = plan.name;
    }

    // Create Razorpay order
    const orderResult = await RazorpayService.createOrder({
      amount: amount * 100, // Convert to paise
      receipt: `${validatedData.type}_${validatedData.item_id}_${userId}_${Date.now()}`,
      notes: {
        type: validatedData.type,
        item_id: validatedData.item_id,
        user_id: userId,
        item_name: itemName
      }
    });

    if (!orderResult.success) {
      return NextResponse.json({
        error: 'Failed to create payment order',
        details: orderResult.error
      }, { status: 500 });
    }

    return NextResponse.json({
      order_id: orderResult.order.id,
      amount: orderResult.order.amount,
      currency: orderResult.order.currency,
      receipt: orderResult.order.receipt,
      item_name: itemName,
      item_type: validatedData.type,
      message: 'Payment order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const POST = withAuth(createOrderHandler);
