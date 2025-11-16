package FoodApp.com.example.FoodAppdemo.repository;
import FoodApp.com.example.FoodAppdemo.model.Seller;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SellerRepository extends MongoRepository<Seller, String> {
    boolean existsByUserId(String userId);
    Seller findByUserId(String userId);
}
