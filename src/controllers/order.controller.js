import orderModel from "../models/order.model.js";
import { userAuthenticationModel } from "../models/userAuthentication.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApplicationError from "../utils/applicationErrors.js";

const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel
      .findById(orderId)
      .populate({ path: "items.product", strictPopulate: false });

    if (!order) {
      throw new ApplicationError("Order not found", 404);
    }

    return res
      .status(200)
      .json(new ApiResponse(true, order, "Order retrived successfully!"));
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.userId;
    let { page = 1 } = req.query;
    const { limit = 10, sort = "-createdAt" } = req.query;
    const skip = (page - 1) * limit;
    let filter = {};
    const user = await userAuthenticationModel.findById(userId);

    if (user.role !== "ADMIN") {
      filter = { user: userId };
    }

    const totalOrders = await orderModel.countDocuments(filter);
    if (!totalOrders) {
      return res.status(200).json(new ApiResponse(true, [], "No orders found"));
    }

    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await orderModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate({ path: "items.product", strictPopulate: false });
    if (!orders) {
      throw new ApplicationError("No orders found", 404);
    }

    return res.status(200).json(
      new ApiResponse(
        true,
        {
          orders,
          pagination: {
            total: totalOrders,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: totalPages,
          },
        },
        "Orders retrived successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// const getUserOrders = async (req, res, next) => {
//   try {
//     const userId = req.userId;

//     let { page = 1 } = req.query;
//     const { limit = 10, sort = "-createdAt" } = req.query;
//     const skip = (page - 1) * limit;

//     const totalOrders = await orderModel.countDocuments();
//     if (!totalOrders) {
//       return res.status(200).json(new ApiResponse(true, [], "No orders found"));
//     }

//     const totalPages = Math.ceil(totalOrders / limit);

//     const orders = await orderModel
//       .find({ user: userId })
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(limit, 10));
//     if (!orders) {
//       throw new ApplicationError("No orders found", 404);
//     }

//     return res.status(200).json(
//       new ApiResponse(
//         true,
//         {
//           orders,
//           pagination: {
//             total: totalOrders,
//             page: parseInt(page, 10),
//             limit: parseInt(limit, 10),
//             totalPages: totalPages,
//           },
//         },
//         "Orders retrived successfully"
//       )
//     );
//   } catch (error) {
//     next(error);
//   }
// };

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req?.body;
    const { orderId } = req?.params;

    const order = await orderModel
      .findOneAndUpdate({ _id: orderId }, { status })
      .populate({ path: "items.product", strictPopulate: false });

    if (!order) {
      throw ApplicationError("Order not found", 404);
    }

    return res
      .status(200)
      .json(new ApiResponse(true, order, "Order updated successfully"));
  } catch (error) {
    next(error);
  }
};


export { getOrder, getOrders, updateOrderStatus };
