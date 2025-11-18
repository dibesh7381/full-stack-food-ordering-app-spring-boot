package FoodApp.com.example.FoodAppdemo.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class UpdateFoodRequest {
    private String name;
    private String type;
    private String category;
    private String description;
    private MultipartFile image;
    private List<FoodSizeDTO> sizes;
}

