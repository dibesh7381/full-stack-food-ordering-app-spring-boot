import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/auth/api",
    credentials: "include",
  }),

  tagTypes: ["Profile", "Seller", "Food", "Cart", "Orders"],

  endpoints: (builder) => ({
    // ----------------------------------
    // SIGNUP
    // ----------------------------------
    signup: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),

    // LOGIN
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Seller"],
    }),

    // LOGOUT
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile", "Seller", "Cart", "Orders"],
    }),

    // PROFILE
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

    // ----------------------------------
    // SELLER SYSTEM
    // ----------------------------------

    becomeSeller: builder.mutation({
      query: ({ data, image }) => {
        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
        formData.append("image", image);

        return {
          url: "/become-seller",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile", "Seller"],
    }),

    getSeller: builder.query({
      query: () => "/seller",
      providesTags: ["Seller"],
    }),

    // ----------------------------------
    // FOOD SYSTEM
    // ----------------------------------

    addFood: builder.mutation({
      query: ({ data, image }) => {
        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
        formData.append("image", image);

        return {
          url: "/add-food",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Food"],
    }),

    getMyFoods: builder.query({
      query: () => "/my-foods",
      providesTags: ["Food"],
    }),

    updateFood: builder.mutation({
      query: ({ id, data, image }) => {
        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );

        if (image) formData.append("image", image);

        return {
          url: `/update-food/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Food"],
    }),

    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/delete-food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Food"],
    }),

    getAllFoods: builder.query({
      query: () => "/all-foods",
      providesTags: ["Food"],
    }),

    // ----------------------------------
    // CART SYSTEM
    // ----------------------------------

    addToCart: builder.mutation({
      query: (body) => ({
        url: "/add-to-cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    getMyCart: builder.query({
      query: () => "/my-cart",
      providesTags: ["Cart"],
    }),

    increaseQty: builder.mutation({
      query: (cartId) => ({
        url: `/cart/increase/${cartId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    decreaseQty: builder.mutation({
      query: (cartId) => ({
        url: `/cart/decrease/${cartId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    deleteCartItem: builder.mutation({
      query: (cartId) => ({
        url: `/cart/delete/${cartId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ----------------------------------
    // ORDER SYSTEM (CUSTOMER)
    // ----------------------------------

    placeOrder: builder.mutation({
      query: (body) => ({
        url: "/place-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),

    getMyOrders: builder.query({
      query: () => "/my-orders",
      providesTags: ["Orders"],
    }),

    // ⭐ UPDATED: CANCEL ORDER
    cancelMyOrder: builder.mutation({
      query: (orderId) => ({
        url: `/my-orders/cancel/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ----------------------------------
    // ORDER SYSTEM (SELLER)
    // ----------------------------------

    getSellerOrders: builder.query({
      query: () => "/seller-orders",
      providesTags: ["Orders"],
    }),

    cancelSellerOrder: builder.mutation({
      query: (orderId) => ({
        url: `/seller-orders/cancel/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

// ----------------------------------
// EXPORT HOOKS
// ----------------------------------

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
  useCancelMyOrderMutation,        // ⭐ NEW
  useGetSellerOrdersQuery,
  useCancelSellerOrderMutation,    // ⭐ NEW
} = authApi;

