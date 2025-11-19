package FoodApp.com.example.FoodAppdemo.repository;

import FoodApp.com.example.FoodAppdemo.model.SellerOrder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SellerOrderRepository extends MongoRepository<SellerOrder, String> {

    List<SellerOrder> findBySellerId(String sellerId);

    // ⭐ For status-sync (customer cancels → get seller order)
    SellerOrder findByTrackingId(String trackingId);
}

