import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { validateData, membershipPurchaseSchema, paymentVerificationSchema } from '@/lib/validation';
import MembershipCard from '@/models/MembershipCard';
import MembershipCardType from '@/models/MembershipCardType';
import { RazorpayService } from '@/lib/razorpay';
import EmailService from '@/lib/emailService';

const purchaseMembershipHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    const body = await req.json();

    // Validate the request body
    const validation = validateData(membershipPurchaseSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already has an active membership card
    const existingCard = await MembershipCard.findOne({
      user_id: userId,
      status: 'active'
    });

    if (existingCard && !existingCard.isExpired()) {
      return NextResponse.json({
        error: 'User already has an active membership card'
      }, { status: 409 });
    }

    const validatedData = validation.data as { card_type_id: string; payment_reference: string; };
    
    // Find the card type
    const cardType = await MembershipCardType.findOne({
      card_type_id: validatedData.card_type_id,
      is_active: true
    });

    if (!cardType) {
      return NextResponse.json({
        error: 'Membership card type not found or not active'
      }, { status: 404 });
    }

    // Verify payment with Razorpay
    const paymentVerification = validateData(paymentVerificationSchema, {
      razorpay_order_id: validatedData.payment_reference,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature
    });

    if (!paymentVerification.success) {
      return NextResponse.json({
        error: 'Payment verification failed',
        details: paymentVerification.errors
      }, { status: 400 });
    }

    const isPaymentValid = RazorpayService.verifyPayment(paymentVerification.data as { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; });
    if (!isPaymentValid) {
      return NextResponse.json({
        error: 'Invalid payment signature'
      }, { status: 400 });
    }

    // Create membership card
    const membershipCard = new MembershipCard({
      user_id: userId,
      card_type_id: validatedData.card_type_id,
      purchase_date: new Date(),
      payment_id: validatedData.payment_reference,
      status: 'active'
    });

    await membershipCard.save();

    // Send confirmation email
    try {
      await EmailService.sendMembershipConfirmation(
        req.user!.email,
        'User', // You might want to fetch the user's name
        cardType.name,
        membershipCard.expiry_date
      );
    } catch (emailError) {
      console.error('Failed to send membership confirmation email:', emailError);
      // Don't fail the purchase if email fails
    }

    return NextResponse.json({
      membership_card_id: membershipCard.membership_card_id,
      user_id: membershipCard.user_id,
      card_type_id: membershipCard.card_type_id,
      card_type_name: cardType.name,
      purchase_date: membershipCard.purchase_date,
      expiry_date: membershipCard.expiry_date,
      status: membershipCard.status,
      message: 'Membership card purchased successfully.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error purchasing membership card:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const POST = withAuth(purchaseMembershipHandler);
