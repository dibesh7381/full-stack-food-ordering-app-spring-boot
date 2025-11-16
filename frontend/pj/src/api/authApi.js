import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/auth/api",
    credentials: "include",
  }),

  tagTypes: ["Profile", "Seller", "Food"],

  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Seller"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile", "Seller"],
    }),

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

    becomeSeller: builder.mutation({
      query: (formData) => ({
        url: "/become-seller",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile", "Seller"],
    }),

    getSeller: builder.query({
      query: () => "/seller",
      providesTags: ["Seller"],
    }),

    // ⭐ ADD FOOD
    addFood: builder.mutation({
      query: (body) => ({
        url: "/add-food",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Food"],
    }),

    // ⭐ My Foods
    getMyFoods: builder.query({
      query: () => "/my-foods",
      providesTags: ["Food"],
    }),

    // ⭐ UPDATE FOOD — FIXED
    updateFood: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-food/${id}`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
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
    // ⭐ All foods (public)
    getAllFoods: builder.query({
      query: () => "/all-foods",
      providesTags: ["Food"],
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
} = authApi;
