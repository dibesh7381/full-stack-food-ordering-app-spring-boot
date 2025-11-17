package FoodApp.com.example.FoodAppdemo.repository;

import FoodApp.com.example.FoodAppdemo.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CartRepository extends MongoRepository<CartItem, String> {

    List<CartItem> findByUserId(String userId);

    boolean existsByUserIdAndFoodIdAndSize(String userId, String foodId, String size);

    CartItem findByUserIdAndFoodIdAndSize(String userId, String foodId, String size);
}

