package FoodApp.com.example.FoodAppdemo.repository;

import FoodApp.com.example.FoodAppdemo.model.CustomerOrder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CustomerOrderRepository extends MongoRepository<CustomerOrder, String> {

    List<CustomerOrder> findByBuyerId(String buyerId);

    // ⭐ For status-sync (seller cancels → get customer order)
    CustomerOrder findByTrackingId(String trackingId);
}

