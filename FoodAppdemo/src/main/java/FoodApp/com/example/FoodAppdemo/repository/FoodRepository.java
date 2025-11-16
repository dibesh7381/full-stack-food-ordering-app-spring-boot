package FoodApp.com.example.FoodAppdemo.repository;

import FoodApp.com.example.FoodAppdemo.model.Food;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FoodRepository extends MongoRepository<Food, String> {
    List<Food> findBySellerId(String sellerId);  // ⭐ ADD THIS
}


