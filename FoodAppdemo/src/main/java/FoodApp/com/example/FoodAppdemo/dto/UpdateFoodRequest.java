package FoodApp.com.example.FoodAppdemo.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateFoodRequest {
    private String name;
    private String type;
    private String category;
    private String description;
    private String imageBase64; // ⭐ new image OR old image
    private List<FoodSizeDTO> sizes;
}

