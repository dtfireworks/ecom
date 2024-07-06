import { customInitApp } from "@/lib/firebase-admin-config";
import { db } from "@/lib/firebase-config";
import { OrderOverview } from "@/types/order";
import { CustomError, handleApiError } from "@/utils/apiErrorHandler";
import { auth } from "firebase-admin";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
customInitApp();

const formatUserFriendlyDate = (date: string) => {
  let tempDate = new Date(date);
  const month = tempDate.toLocaleString("default", { month: "long" });
  return `${tempDate.getDay()} ${month} ${tempDate.getFullYear()}`;
};

export const GET = async (request: NextRequest) => {
  try {
    const session = request.cookies.get("session");
    console.log(session);
    console.log(session?.value);
    if (!session) {
      throw new CustomError("Unauthorized", 401);
    }

    const user = await auth().verifySessionCookie(session.value, true);
    const uid = user.uid;

    const ordersQuery = query(
      collection(db, "online-orders"),
      where("uid", "==", uid),
    );
    const querySnapshot = await getDocs(ordersQuery);

    if (querySnapshot.empty) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const orders: OrderOverview[] = querySnapshot.docs.map((doc) => ({
      orderId: doc.id,
      orderDate: formatUserFriendlyDate(doc.data().createdAt),
      orderTotal: doc.data().orderTotal,
    }));

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    return handleApiError(error);
  }
};
