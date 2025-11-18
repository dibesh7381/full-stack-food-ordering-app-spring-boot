import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/auth/api",
    credentials: "include",
  }),

  tagTypes: ["Profile", "Seller", "Food", "Cart"],

  endpoints: (builder) => ({

    // ⭐ SIGNUP
    signup: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),

    // ⭐ LOGIN
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Seller"],
    }),

    // ⭐ LOGOUT
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile", "Seller", "Cart"],
    }),

    // ⭐ PROFILE
    profile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    homepage: builder.query({
      query: () => "/homepage",
    }),

    // ⭐ BECOME SELLER — MULTIPART
    becomeSeller: builder.mutation({
      query: ({ data, image }) => {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
        formData.append("image", image);

        return {
          url: "/become-seller",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile", "Seller"],
    }),

    // ⭐ GET SELLER DETAILS
    getSeller: builder.query({
      query: () => "/seller",
      providesTags: ["Seller"],
    }),

    // ⭐ ADD FOOD — MULTIPART
    addFood: builder.mutation({
      query: ({ data, image }) => {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
        formData.append("image", image);

        return {
          url: "/add-food",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Food"],
    }),

    // ⭐ MY FOODS
    getMyFoods: builder.query({
      query: () => "/my-foods",
      providesTags: ["Food"],
    }),

    // ⭐ UPDATE FOOD — MULTIPART
    updateFood: builder.mutation({
      query: ({ id, data, image }) => {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

        if (image) {
          formData.append("image", image);
        }

        return {
          url: `/update-food/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Food"],
    }),

    // ⭐ DELETE FOOD
    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/delete-food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Food"],
    }),

    // ⭐ GET ALL FOODS
    getAllFoods: builder.query({
      query: () => "/all-foods",
      providesTags: ["Food"],
    }),

    // ⭐⭐⭐ ADD TO CART
    addToCart: builder.mutation({
      query: (body) => ({
        url: "/add-to-cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ⭐⭐⭐ GET MY CART
    getMyCart: builder.query({
      query: () => "/my-cart",
      providesTags: ["Cart"],
    }),

    // ⭐⭐⭐ INCREASE QTY
    increaseQty: builder.mutation({
      query: (cartId) => ({
        url: `/cart/increase/${cartId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ⭐⭐⭐ DECREASE QTY
    decreaseQty: builder.mutation({
      query: (cartId) => ({
        url: `/cart/decrease/${cartId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ⭐⭐⭐ DELETE CART ITEM
    deleteCartItem: builder.mutation({
      query: (cartId) => ({
        url: `/cart/delete/${cartId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ⭐⭐⭐ PLACE ORDER
    placeOrder: builder.mutation({
      query: (body) => ({
        url: "/place-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ⭐⭐⭐ GET MY ORDERS
    getMyOrders: builder.query({
      query: () => "/my-orders",
    }),

    getSellerOrders: builder.query({
      query: () => "/seller-orders",
    }),

    // ⭐⭐⭐ DELETE BUYER ORDER
    deleteMyOrder: builder.mutation({
      query: (orderId) => ({
        url: `/my-orders/${orderId}`,
        method: "DELETE",
      }),
    }),

    // ⭐⭐⭐ DELETE SELLER ORDER
    deleteSellerOrder: builder.mutation({
      query: (orderId) => ({
        url: `/seller-orders/${orderId}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useHomepageQuery,
  useBecomeSellerMutation,
  useGetSellerQuery,

  useAddFoodMutation,
  useGetMyFoodsQuery,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  useGetAllFoodsQuery,

  useAddToCartMutation,
  useGetMyCartQuery,
  useIncreaseQtyMutation,
  useDecreaseQtyMutation,
  useDeleteCartItemMutation,

  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetSellerOrdersQuery,

  useDeleteMyOrderMutation,
  useDeleteSellerOrderMutation

} = authApi;
