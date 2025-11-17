package FoodApp.com.example.FoodAppdemo.repository;

import FoodApp.com.example.FoodAppdemo.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByBuyerId(String buyerId);   // 🔥 FIXED
    List<Order> findBySellerId(String sellerId);
    List<Order> findByFoodIdIn(List<String> foodIds);

}


