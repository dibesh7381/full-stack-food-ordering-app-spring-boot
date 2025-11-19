package FoodApp.com.example.FoodAppdemo.controller;

import FoodApp.com.example.FoodAppdemo.dto.*;
import FoodApp.com.example.FoodAppdemo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/auth/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;



    // ⭐ SIGNUP
    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<SignupResponseDTO>> signup(@RequestBody SignupRequestDTO request) {
        SignupResponseDTO response = authService.signup(request);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Signup successful", response));
    }



    // ⭐ LOGIN WITH COOKIE
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@RequestBody LoginRequestDTO request) {

        LoginResponseDTO loginRes = authService.login(request);

        ResponseCookie tokenCookie = ResponseCookie.from("token", loginRes.getToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        loginRes.setToken(null);

        return ResponseEntity.ok()
                .header("Set-Cookie", tokenCookie.toString())
                .body(new ApiResponseDTO<>(true, "Login successful", loginRes));
    }



    // ⭐ LOGOUT
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<String>> logout() {

        ResponseCookie clearCookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", clearCookie.toString())
                .body(new ApiResponseDTO<>(true, "Logged out successfully", null));
    }



    // ⭐ PROFILE
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<ProfileResponseDTO>> profile() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileResponseDTO profile = authService.getProfile(email);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Profile fetched successfully", profile));
    }



    // ⭐ UPDATE PROFILE
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<ProfileResponseDTO>> updateProfile(
            @RequestBody UpdateProfileRequestDTO dto
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileResponseDTO updated = authService.updateProfile(email, dto);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Profile updated successfully", updated));
    }



    // ⭐ HOME PAGE
    @GetMapping("/homepage")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<?>> getHomePage() {
        HomePageDTO dto = authService.homePage();
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "HomePage fetched successfully", dto));
    }



    // ⭐ BECOME SELLER
    @PostMapping("/become-seller")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<SellerResponseDTO>> becomeSeller(
            @RequestPart("data") SellerRequestDTO dto,
            @RequestPart("image") MultipartFile image
    ) {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        SellerResponseDTO response = authService.becomeSeller(email, dto, image);

        String newToken = response.getToken();
        ResponseCookie tokenCookie = ResponseCookie.from("token", newToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.setToken(null);

        return ResponseEntity.ok()
                .header("Set-Cookie", tokenCookie.toString())
                .body(new ApiResponseDTO<>(true, "Seller created successfully", response));
    }



    // ⭐ GET SELLER DETAILS
    @GetMapping("/seller")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<SellerResponseDTO>> getSellerData() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        SellerResponseDTO seller = authService.getSeller(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Seller details fetched successfully", seller)
        );
    }



    // ⭐ ADD FOOD
    @PostMapping("/add-food")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<FoodResponseDTO>> addFood(
            @RequestPart("data") AddFoodRequest dto,
            @RequestPart("image") MultipartFile image
    ) throws Exception {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        FoodResponseDTO savedFood = authService.addFood(email, image, dto);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Food added successfully", savedFood)
        );
    }



    // ⭐ GET MY FOODS
    @GetMapping("/my-foods")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<List<FoodResponseDTO>>> getMyFoods() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<FoodResponseDTO> foods = authService.getMyFoods(email);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Seller foods fetched", foods));
    }




    // ⭐ DELETE FOOD
    @DeleteMapping("/delete-food/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<String>> deleteFood(@PathVariable String id) {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        authService.deleteFood(email, id);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Food deleted successfully", null));
    }




    // ⭐ GET ALL FOODS
    @GetMapping("/all-foods")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<List<FoodResponseDTO>>> getAllFoods() {

        List<FoodResponseDTO> foods = authService.getAllFoods();

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "All foods fetched successfully", foods)
        );
    }



    // ⭐⭐⭐ ADD TO CART
    @PostMapping("/add-to-cart")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<CartItemResponseDTO>> addToCart(
            @RequestBody AddToCartRequestDTO req
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CartItemResponseDTO response = authService.addToCart(email, req);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Item added to cart", response)
        );
    }



    // ⭐⭐⭐ GET CART ITEMS
    @GetMapping("/my-cart")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<List<CartItemResponseDTO>>> getMyCart() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<CartItemResponseDTO> items = authService.getMyCart(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Cart items fetched successfully", items)
        );
    }




    // ⭐⭐⭐ DELETE CART ITEM
    @DeleteMapping("/cart/delete/{cartId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<String>> deleteCartItem(
            @PathVariable String cartId
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authService.deleteCartItem(email, cartId);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Item removed from cart", null)
        );
    }



    // ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
    //       ORDER SYSTEM (UPDATED)
    // ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐


    // ⭐ PLACE ORDER
    @PostMapping("/place-order")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<CustomerOrderResponseDTO>> placeOrder(
            @RequestBody PlaceOrderRequestDTO dto
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CustomerOrderResponseDTO order = authService.placeOrder(email, dto);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Order placed successfully", order)
        );
    }



    // ⭐ CUSTOMER ORDERS
    @GetMapping("/my-orders")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<List<CustomerOrderResponseDTO>>> getMyOrders() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<CustomerOrderResponseDTO> orders = authService.getMyOrders(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Order history fetched successfully", orders)
        );
    }



    // ⭐ SELLER ORDERS
    @GetMapping("/seller-orders")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<List<SellerOrderResponseDTO>>> getSellerOrders() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<SellerOrderResponseDTO> orders = authService.getSellerOrders(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Seller orders fetched successfully", orders)
        );
    }

    // ⭐ CUSTOMER CANCEL ORDER (Status = CANCELLED)
    @PutMapping("/my-orders/cancel/{orderId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<String>> cancelMyOrder(
            @PathVariable String orderId
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authService.cancelMyOrder(email, orderId);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Order cancelled successfully", null)
        );
    }

    // ⭐ SELLER CANCEL ORDER (Status = CANCELLED)
    @PutMapping("/seller-orders/cancel/{orderId}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<String>> cancelSellerOrder(
            @PathVariable String orderId
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authService.cancelSellerOrder(email, orderId);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Order cancelled successfully", null)
        );
    }


}
