export interface Vehicle {
    stock_number: string;
    allpagedata_images: string[];
    allpagedata_fields: Record<string, any>;
    vin_display: string;
    final_bid: string;
    stock_number_href: string;
    allpagedata_3sixty: string[];
    ocr_result?: string;
    allpagedata_passed: boolean;
    details?: {
      year: string;
      make: string;
      model: string;
    };
  }
  
  export interface Custom360SpinProps {
    images: string[];
    onClose: () => void;
  }
  
  export interface VehicleListPageProps {
    vehicles: Vehicle[];
    loading: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: (val: boolean) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
  }
  
  export interface VehicleDetailPageProps {
    vehicles: Vehicle[];
  } 