package FoodApp.com.example.FoodAppdemo.service;

import FoodApp.com.example.FoodAppdemo.dto.*;
import FoodApp.com.example.FoodAppdemo.exception.CustomException;
import FoodApp.com.example.FoodAppdemo.model.*;
import FoodApp.com.example.FoodAppdemo.repository.*;
import FoodApp.com.example.FoodAppdemo.security.JwtUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private Cloudinary cloudinary;



    // ⭐ SIGNUP
    public SignupResponseDTO signup(SignupRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already registered!", 400);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CUSTOMER");

        User saved = userRepository.save(user);

        return new SignupResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getRole()
        );
    }



    // ⭐ LOGIN
    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) throw new CustomException("User not found!", 404);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid credentials!", 401);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new LoginResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }



    // ⭐ GET PROFILE
    public ProfileResponseDTO getProfile(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        return new ProfileResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }



    // ⭐ UPDATE PROFILE
    public ProfileResponseDTO updateProfile(String email, UpdateProfileRequestDTO dto) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        User updated = userRepository.save(user);

        return new ProfileResponseDTO(
                updated.getId(),
                updated.getUsername(),
                updated.getEmail(),
                updated.getRole()
        );
    }



    // ⭐ HOME PAGE
    public HomePageDTO homePage() {
        return new HomePageDTO(
                "This is for Home Page",
                "Visible for all users"
        );
    }



    // ⭐ BECOME SELLER
    public SellerResponseDTO becomeSeller(String email, SellerRequestDTO dto, MultipartFile image) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        if (sellerRepository.existsByUserId(user.getId())) {
            throw new CustomException("You are already a seller!", 400);
        }

        // ⭐ Upload image to cloudinary
        String imageUrl;
        try {
            var upload = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap("folder", "foodapp/sellers")
            );
            imageUrl = upload.get("secure_url").toString();
        } catch (Exception e) {
            throw new CustomException("Image upload failed!", 500);
        }

        Seller seller = new Seller(
                null,
                user.getId(),
                dto.getShopName(),
                dto.getLocation(),
                dto.getEstablishedYear(),
                dto.getBusinessType(),
                imageUrl,
                dto.getOwnerName()
        );

        Seller saved = sellerRepository.save(seller);

        // Upgrade role
        user.setRole("SELLER");
        userRepository.save(user);

        String newToken = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new SellerResponseDTO(
                saved.getId(),
                saved.getUserId(),
                saved.getShopName(),
                saved.getLocation(),
                saved.getEstablishedYear(),
                saved.getBusinessType(),
                saved.getImageUrl(),
                saved.getOwnerName(),
                user.getRole(),
                newToken
        );
    }



    // ⭐ GET SELLER DETAILS
    public SellerResponseDTO getSeller(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("Seller profile not found!", 404);

        return new SellerResponseDTO(
                seller.getId(),
                seller.getUserId(),
                seller.getShopName(),
                seller.getLocation(),
                seller.getEstablishedYear(),
                seller.getBusinessType(),
                seller.getImageUrl(),
                seller.getOwnerName(),
                user.getRole(),
                null
        );
    }



    // ⭐ ADD FOOD
    public FoodResponseDTO addFood(String email, MultipartFile image, AddFoodRequest dto) throws Exception {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("You are not a seller!", 403);

        // ⭐ Upload multipart image
        String imageUrl;
        try {
            var upload = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap("folder", "foodapp/foods")
            );
            imageUrl = upload.get("secure_url").toString();
        } catch (Exception e) {
            throw new CustomException("Image upload failed!", 500);
        }

        Food food = new Food();
        food.setName(dto.getName());
        food.setType(dto.getType());
        food.setCategory(dto.getCategory());
        food.setDescription(dto.getDescription());
        food.setSellerId(user.getId());
        food.setImageUrl(imageUrl);

        List<FoodSize> sizes = dto.getSizes().stream()
                .map(s -> new FoodSize(s.getSize(), s.getPrice()))
                .toList();

        food.setSizes(sizes);

        Food saved = foodRepository.save(food);

        List<FoodSizeDTO> sizeDTOs = sizes.stream()
                .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                .toList();

        return new FoodResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getType(),
                saved.getCategory(),
                saved.getDescription(),
                saved.getImageUrl(),
                sizeDTOs,
                seller.getShopName()
        );
    }




    // ⭐ GET MY FOODS
    public List<FoodResponseDTO> getMyFoods(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("You are not a seller!", 403);

        List<Food> foods = foodRepository.findBySellerId(user.getId());

        return foods.stream().map(food ->
                new FoodResponseDTO(
                        food.getId(),
                        food.getName(),
                        food.getType(),
                        food.getCategory(),
                        food.getDescription(),
                        food.getImageUrl(),
                        food.getSizes().stream()
                                .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                                .toList(),
                        seller.getShopName()
                )
        ).toList();
    }



    // ⭐ UPDATE FOOD
    public FoodResponseDTO updateFood(
            String email,
            MultipartFile image,
            String id,
            UpdateFoodRequest dto
    ) throws Exception {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("Not a seller!", 403);

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new CustomException("Food not found!", 404));

        food.setName(dto.getName());
        food.setType(dto.getType());
        food.setCategory(dto.getCategory());
        food.setDescription(dto.getDescription());

        // ⭐ upload multipart image if provided
        if (image != null && !image.isEmpty()) {
            var upload = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap("folder", "foodapp/foods")
            );
            food.setImageUrl(upload.get("secure_url").toString());
        }

        food.setSizes(
                dto.getSizes().stream()
                        .map(s -> new FoodSize(s.getSize(), s.getPrice()))
                        .toList()
        );

        Food saved = foodRepository.save(food);

        List<FoodSizeDTO> sizeList = saved.getSizes().stream()
                .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                .toList();

        return new FoodResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getType(),
                saved.getCategory(),
                saved.getDescription(),
                saved.getImageUrl(),
                sizeList,
                seller.getShopName()
        );
    }




    // ⭐ DELETE FOOD
    public void deleteFood(String email, String id) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new CustomException("Food not found!", 404));

        foodRepository.delete(food);
    }



    // ⭐ GET ALL FOODS
    public List<FoodResponseDTO> getAllFoods() {

        List<Food> foods = foodRepository.findAll();

        return foods.stream().map(food -> {

            Seller seller = sellerRepository.findByUserId(food.getSellerId());

            return new FoodResponseDTO(
                    food.getId(),
                    food.getName(),
                    food.getType(),
                    food.getCategory(),
                    food.getDescription(),
                    food.getImageUrl(),
                    food.getSizes().stream()
                            .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                            .toList(),
                    seller != null ? seller.getShopName() : "Unknown"
            );

        }).toList();
    }



    // ⭐⭐⭐ ADD TO CART — NEW SERVICE METHOD HERE
    public CartItemResponseDTO addToCart(String email, AddToCartRequestDTO req) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Food food = foodRepository.findById(req.getFoodId())
                .orElseThrow(() -> new CustomException("Food not found!", 404));

        // find size price
        FoodSize size = food.getSizes().stream()
                .filter(s -> s.getSize().equals(req.getSize()))
                .findFirst()
                .orElseThrow(() -> new CustomException("Invalid size!", 400));

        double price = size.getPrice() * req.getQuantity();

        // if item exists → update quantity
        if (cartRepository.existsByUserIdAndFoodIdAndSize(user.getId(), req.getFoodId(), req.getSize())) {

            CartItem item = cartRepository.findByUserIdAndFoodIdAndSize(
                    user.getId(),
                    req.getFoodId(),
                    req.getSize());

            item.setQuantity(item.getQuantity() + req.getQuantity());
            item.setPrice(item.getQuantity() * size.getPrice());

            CartItem updated = cartRepository.save(item);

            return new CartItemResponseDTO(
                    updated.getId(),
                    updated.getFoodId(),
                    updated.getFoodName(),
                    updated.getSize(),
                    updated.getQuantity(),
                    updated.getPrice(),
                    updated.getImageUrl()
            );
        }

        // new item
        CartItem newItem = new CartItem(
                null,
                user.getId(),
                food.getId(),
                food.getName(),
                req.getSize(),
                req.getQuantity(),
                price,
                food.getImageUrl()
        );

        CartItem saved = cartRepository.save(newItem);

        return new CartItemResponseDTO(
                saved.getId(),
                saved.getFoodId(),
                saved.getFoodName(),
                saved.getSize(),
                saved.getQuantity(),
                saved.getPrice(),
                saved.getImageUrl()
        );
    }

    public List<CartItemResponseDTO> getMyCart(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        List<CartItem> items = cartRepository.findByUserId(user.getId());

        return items.stream()
                .map(item -> new CartItemResponseDTO(
                        item.getId(),
                        item.getFoodId(),
                        item.getFoodName(),
                        item.getSize(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getImageUrl()
                ))
                .toList();
    }

    public CartItemResponseDTO increaseQty(String email, String cartId) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        CartItem item = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException("Cart item not found!", 404));

        // increase qty
        item.setQuantity(item.getQuantity() + 1);

        // unit price = price/qtyBefore
        double unitPrice = item.getPrice() / (item.getQuantity() - 1);
        item.setPrice(item.getQuantity() * unitPrice);

        CartItem saved = cartRepository.save(item);

        return new CartItemResponseDTO(
                saved.getId(),
                saved.getFoodId(),
                saved.getFoodName(),
                saved.getSize(),
                saved.getQuantity(),
                saved.getPrice(),
                saved.getImageUrl()
        );
    }

    public CartItemResponseDTO decreaseQty(String email, String cartId) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        CartItem item = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException("Cart item not found!", 404));

        // if qty = 1 → delete
        if (item.getQuantity() == 1) {
            cartRepository.delete(item);
            throw new CustomException("Item removed from cart", 200);
        }

        double unitPrice = item.getPrice() / item.getQuantity();

        item.setQuantity(item.getQuantity() - 1);
        item.setPrice(item.getQuantity() * unitPrice);

        CartItem saved = cartRepository.save(item);

        return new CartItemResponseDTO(
                saved.getId(),
                saved.getFoodId(),
                saved.getFoodName(),
                saved.getSize(),
                saved.getQuantity(),
                saved.getPrice(),
                saved.getImageUrl()
        );
    }

    public void deleteCartItem(String email, String cartId) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        CartItem item = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException("Cart item not found!", 404));

        cartRepository.delete(item);
    }


    public OrderResponseDTO placeOrder(String email, PlaceOrderRequestDTO req) {

        User buyer = userRepository.findByEmail(email);
        if (buyer == null) throw new CustomException("User not found!", 404);

        Food food = foodRepository.findById(req.getFoodId())
                .orElseThrow(() -> new CustomException("Food not found!", 404));

        Seller seller = sellerRepository.findByUserId(food.getSellerId());
        if (seller == null) throw new CustomException("Seller not found!", 404);

        FoodSize size = food.getSizes().stream()
                .filter(s -> s.getSize().equals(req.getSize()))
                .findFirst()
                .orElseThrow(() -> new CustomException("Invalid size!", 400));

        double price = size.getPrice() * req.getQuantity();

        // SAVE ORDER
        Order order = new Order(
                null,                      // id
                buyer.getId(),            // buyerId (Long)
                food.getId(),             // foodId (String)
                food.getName(),           // foodName
                req.getSize(),            // size
                req.getQuantity(),        // quantity
                price,                    // price
                seller.getId().toString(),// sellerId (String)
                LocalDateTime.now()       // createdAt
        );


        Order savedOrder = orderRepository.save(order);

        return new OrderResponseDTO(
                savedOrder.getId(),
                savedOrder.getFoodName(),
                savedOrder.getSize(),
                savedOrder.getQuantity(),
                savedOrder.getPrice(),
                savedOrder.getCreatedAt().toString()
        );
    }

    public List<OrderResponseDTO> getMyOrders(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        return orderRepository.findByBuyerId(user.getId())
                .stream()
                .map(o -> new OrderResponseDTO(
                        o.getId(),
                        o.getFoodName(),
                        o.getSize(),
                        o.getQuantity(),
                        o.getPrice(),
                        o.getCreatedAt().toString()
                )).toList();
    }

    public List<OrderResponseDTO> getSellerOrders(String email) {

        User seller = userRepository.findByEmail(email);
        if (seller == null) throw new CustomException("User not found!", 404);

        // find all foods of seller
        List<Food> foods = foodRepository.findBySellerId(seller.getId());

        // Collect ALL foodIds that belong to seller
        List<String> foodIds = foods.stream()
                .map(Food::getId)
                .toList();

        // find all orders where foodId is in seller's foods
        List<Order> orders = orderRepository.findByFoodIdIn(foodIds);

        return orders.stream()
                .map(o -> new OrderResponseDTO(
                        o.getId(),
                        o.getFoodName(),
                        o.getSize(),
                        o.getQuantity(),
                        o.getPrice(),
                        o.getCreatedAt().toString()
                ))
                .toList();
    }

    public void deleteMyOrder(String email, String orderId) {

        User buyer = userRepository.findByEmail(email);
        if (buyer == null) throw new CustomException("User not found!", 404);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found!", 404));

        // Check if buyer deleting own order
        if (!order.getBuyerId().equals(buyer.getId())) {
            throw new CustomException("Not your order!", 403);
        }

        orderRepository.delete(order);
    }



    public void deleteSellerOrder(String email, String orderId) {

        User seller = userRepository.findByEmail(email);
        if (seller == null) throw new CustomException("User not found!", 404);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found!", 404));

        // Check if order belongs to seller
        if (!order.getSellerId().equals(seller.getId().toString())) {
            throw new CustomException("You cannot delete others' orders!", 403);
        }

        orderRepository.delete(order);
    }

}
