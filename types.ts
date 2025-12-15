
export interface VehicleFormData {
  // Main Details
  price: string; // Using string for input handling, convert to number on submit
  category: '4w' | '2w';
  make: string;
  model: string;
  variant: string;
  year: string; // Manufacturing Year
  status: 'For Sale' | 'Sold' | 'Paused';
  verified: boolean;

  // Step 1 Fields
  vehicleType: 'Private' | 'Commercial';
  fuelType: string;
  transmission: 'Manual' | 'Automatic';
  regNumber: string;
  chassisNumber: string;
  mfgYear: string;
  regYear: string;
  validUpto: string;
  rtoState: string;
  odometer: string;
  ownership: string;
  
  // Tax & RC
  tax: 'OTT' | 'LTT';
  rcAvailable: boolean;
  scraped: boolean;
  hypothecation: 'Open' | 'Close' | 'NA';

  // Insurance
  insurance: string;
  insuranceExpiry: string;

  // Other
  serviceHistory: 'Available' | 'Not Available';
  color: string;
  remarks: string;

  // --- STEP 2: EXTERIOR & INSPECTION FIELDS ---
  // Convention: insp_[part]_status: 'OK' | 'Issue' | 'NA'
  insp_bumper_status: string;
  insp_bumper_remark: string;
  
  insp_bonnet_status: string;
  insp_bonnet_remark: string;

  insp_roof_status: string;
  insp_roof_remark: string;

  insp_fender_status: string;
  insp_fender_remark: string;

  insp_doors_status: string;
  insp_doors_remark: string;

  insp_pillars_status: string;
  insp_pillars_remark: string;

  insp_quarter_panel_status: string;
  insp_quarter_panel_remark: string;

  insp_dickey_door_status: string;
  insp_dickey_door_remark: string;

  insp_apron_status: string;
  insp_apron_remark: string;

  insp_apron_leg_status: string;
  insp_apron_leg_remark: string;

  insp_firewall_status: string;
  insp_firewall_remark: string;

  insp_cowl_top_status: string;
  insp_cowl_top_remark: string;

  insp_lower_cross_member_status: string;
  insp_lower_cross_member_remark: string;

  insp_upper_cross_member_status: string;
  insp_upper_cross_member_remark: string;

  insp_front_show_status: string;
  insp_front_show_remark: string;

  insp_windshield_status: string;
  insp_windshield_remark: string;

  insp_orvm_status: string;
  insp_orvm_remark: string;

  insp_lights_status: string;
  insp_lights_remark: string;

  insp_fog_lights_status: string;
  insp_fog_lights_remark: string;

  insp_alloy_wheels_status: string;
  insp_alloy_wheels_remark: string;

  insp_wheels_status: string;
  insp_wheels_remark: string;

  // --- STEP 3: ELECTRICAL & INTERIOR ---
  insp_power_window_status: string;
  insp_power_window_remark: string;

  insp_airbag_status: string;
  insp_airbag_remark: string;

  insp_electrical_status: string;
  insp_electrical_remark: string;

  insp_interior_status: string;
  insp_interior_remark: string;

  insp_music_system_status: string;
  insp_music_system_remark: string;

  insp_seat_status: string;
  insp_seat_remark: string;

  insp_sunroof_status: string;
  insp_sunroof_remark: string;

  insp_camera_sensor_status: string;
  insp_camera_sensor_remark: string;

  // --- STEP 4: ENGINE & TRANSMISSION ---
  insp_engine_assembly_status: string; // Engine Assembly
  insp_engine_assembly_remark: string;

  insp_battery_status: string;
  insp_battery_remark: string;

  insp_engine_oil_status: string; // Quality/Condition
  insp_engine_oil_remark: string;

  insp_engine_oil_level_status: string;
  insp_engine_oil_level_remark: string;

  insp_coolant_status: string;
  insp_coolant_remark: string;

  insp_engine_mounting_status: string;
  insp_engine_mounting_remark: string;

  insp_engine_sound_status: string;
  insp_engine_sound_remark: string;

  insp_engine_smoke_status: string;
  insp_engine_smoke_remark: string;

  insp_blowby_status: string; // Permissible Blowby
  insp_blowby_remark: string;

  insp_back_compression_status: string;
  insp_back_compression_remark: string;

  insp_clutch_status: string;
  insp_clutch_remark: string;

  insp_gear_shifting_status: string;
  insp_gear_shifting_remark: string;

  // --- STEP 5: STEERING & SUSPENSION ---
  insp_suspension_status: string;
  insp_suspension_remark: string;

  insp_steering_status: string;
  insp_steering_remark: string;

  insp_brake_status: string;
  insp_brake_remark: string;

  // --- STEP 6: AIR CONDITIONING ---
  insp_ac_status: string;
  insp_ac_remark: string;

  insp_heater_status: string;
  insp_heater_remark: string;

  insp_climate_control_status: string;
  insp_climate_control_remark: string;
}

// Interface for Vehicle data received from API
export interface ApiVehicle extends Omit<VehicleFormData, 'price'> {
  id: string;
  price: number;
  imageUrl?: string;
  mainImage?: string; // Main Cover Photo path from backend
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface VehicleImages {
  // Documents
  mainImage: File | null;
  img_rc: File | null;
  img_noc: File | null;

  // Standard Gallery (Step 7)
  img_front: File | null;
  img_front_right: File | null;
  img_right: File | null;
  img_back_right: File | null;
  img_back: File | null;
  img_open_dickey: File | null;
  img_back_left: File | null;
  img_left: File | null;
  img_front_left: File | null;
  img_open_bonnet: File | null;
  img_dashboard: File | null;
  img_right_front_door: File | null;
  img_right_back_door: File | null;
  img_engine: File | null;
  img_roof: File | null;

  // Tyres (Step 2)
  img_tyre_1: File | null;
  img_tyre_2: File | null;
  img_tyre_3: File | null;
  img_tyre_4: File | null;
  img_tyre_optional: File | null;

  // Damage / Inspection Images (Step 2 & 3 Conditional)
  img_insp_bumper?: File | null;
  img_insp_bonnet?: File | null;
  img_insp_roof?: File | null;
  img_insp_fender?: File | null;
  
  img_insp_door_1?: File | null;
  img_insp_door_2?: File | null;
  img_insp_door_3?: File | null;
  img_insp_door_4?: File | null;

  img_insp_pillar_1?: File | null;
  img_insp_pillar_2?: File | null;
  img_insp_pillar_3?: File | null;
  img_insp_pillar_4?: File | null;
  img_insp_pillar_5?: File | null;
  img_insp_pillar_6?: File | null;

  img_insp_quarter_panel?: File | null;
  img_insp_dickey_door?: File | null;
  
  img_insp_apron_1?: File | null;
  img_insp_apron_2?: File | null;

  img_insp_apron_leg_1?: File | null;
  img_insp_apron_leg_2?: File | null;

  img_insp_firewall?: File | null;
  img_insp_cowl_top?: File | null;
  img_insp_lower_cross_member?: File | null;
  img_insp_upper_cross_member?: File | null;
  img_insp_front_show?: File | null;
  img_insp_windshield?: File | null;
  
  img_insp_orvm_1?: File | null;
  img_insp_orvm_2?: File | null;

  img_insp_lights_1?: File | null;
  img_insp_lights_2?: File | null;

  img_insp_fog_lights_1?: File | null;
  img_insp_fog_lights_2?: File | null;

  // --- STEP 4: ENGINE & TRANSMISSION FILES ---
  img_insp_engine_assembly?: File | null;
  img_insp_battery?: File | null;
  img_insp_engine_oil?: File | null;
  img_insp_engine_oil_level?: File | null;
  img_insp_coolant?: File | null;
  
  // Videos (Max 10s)
  video_insp_engine_sound?: File | null;
  video_insp_engine_smoke?: File | null;
  video_insp_blowby?: File | null;

  [key: string]: File | null | undefined;
}

export const INITIAL_FORM_DATA: VehicleFormData = {
  price: '',
  category: '4w',
  vehicleType: 'Private',
  make: '',
  model: '',
  variant: '',
  year: '',
  status: 'For Sale',
  verified: false,
  mfgYear: '',
  regYear: '',
  validUpto: '',
  regNumber: '',
  chassisNumber: '',
  odometer: '',
  fuelType: 'Petrol',
  transmission: 'Manual',
  rtoState: '',
  ownership: '1st Owner',
  tax: 'LTT',
  rcAvailable: true,
  scraped: false,
  hypothecation: 'NA',
  insurance: '',
  insuranceExpiry: '',
  serviceHistory: 'Available',
  color: '',
  remarks: '',

  // Initialize Exterior Inspection Fields
  insp_bumper_status: 'OK', insp_bumper_remark: '',
  insp_bonnet_status: 'OK', insp_bonnet_remark: '',
  insp_roof_status: 'OK', insp_roof_remark: '',
  insp_fender_status: 'OK', insp_fender_remark: '',
  insp_doors_status: 'OK', insp_doors_remark: '',
  insp_pillars_status: 'OK', insp_pillars_remark: '',
  insp_quarter_panel_status: 'OK', insp_quarter_panel_remark: '',
  insp_dickey_door_status: 'OK', insp_dickey_door_remark: '',
  insp_apron_status: 'OK', insp_apron_remark: '',
  insp_apron_leg_status: 'OK', insp_apron_leg_remark: '',
  insp_firewall_status: 'OK', insp_firewall_remark: '',
  insp_cowl_top_status: 'OK', insp_cowl_top_remark: '',
  insp_lower_cross_member_status: 'OK', insp_lower_cross_member_remark: '',
  insp_upper_cross_member_status: 'OK', insp_upper_cross_member_remark: '',
  insp_front_show_status: 'OK', insp_front_show_remark: '',
  insp_windshield_status: 'OK', insp_windshield_remark: '',
  insp_orvm_status: 'OK', insp_orvm_remark: '',
  insp_lights_status: 'OK', insp_lights_remark: '',
  insp_fog_lights_status: 'OK', insp_fog_lights_remark: '',
  insp_alloy_wheels_status: 'OK', insp_alloy_wheels_remark: '',
  insp_wheels_status: 'OK', insp_wheels_remark: '',

  // Initialize Electrical & Interior Fields
  insp_power_window_status: 'OK', insp_power_window_remark: '',
  insp_airbag_status: 'OK', insp_airbag_remark: '',
  insp_electrical_status: 'OK', insp_electrical_remark: '',
  insp_interior_status: 'OK', insp_interior_remark: '',
  insp_music_system_status: 'OK', insp_music_system_remark: '',
  insp_seat_status: 'OK', insp_seat_remark: '',
  insp_sunroof_status: 'NA', insp_sunroof_remark: '',
  insp_camera_sensor_status: 'NA', insp_camera_sensor_remark: '',

  // Initialize Engine & Transmission Fields
  insp_engine_assembly_status: 'OK', insp_engine_assembly_remark: '',
  insp_battery_status: 'OK', insp_battery_remark: '',
  insp_engine_oil_status: 'OK', insp_engine_oil_remark: '',
  insp_engine_oil_level_status: 'OK', insp_engine_oil_level_remark: '',
  insp_coolant_status: 'OK', insp_coolant_remark: '',
  insp_engine_mounting_status: 'OK', insp_engine_mounting_remark: '',
  insp_engine_sound_status: 'OK', insp_engine_sound_remark: '',
  insp_engine_smoke_status: 'OK', insp_engine_smoke_remark: '',
  insp_blowby_status: 'OK', insp_blowby_remark: '',
  insp_back_compression_status: 'OK', insp_back_compression_remark: '',
  insp_clutch_status: 'OK', insp_clutch_remark: '',
  insp_gear_shifting_status: 'OK', insp_gear_shifting_remark: '',

  // Initialize Steering & Suspension Fields
  insp_suspension_status: 'OK', insp_suspension_remark: '',
  insp_steering_status: 'OK', insp_steering_remark: '',
  insp_brake_status: 'OK', insp_brake_remark: '',

  // Initialize Air Conditioning Fields
  insp_ac_status: 'OK', insp_ac_remark: '',
  insp_heater_status: 'OK', insp_heater_remark: '',
  insp_climate_control_status: 'NA', insp_climate_control_remark: '',
};

export const INITIAL_IMAGES: VehicleImages = {
  mainImage: null,
  img_rc: null,
  img_noc: null,
  img_front: null,
  img_front_right: null,
  img_right: null,
  img_back_right: null,
  img_back: null,
  img_open_dickey: null,
  img_back_left: null,
  img_left: null,
  img_front_left: null,
  img_open_bonnet: null,
  img_dashboard: null,
  img_right_front_door: null,
  img_right_back_door: null,
  img_engine: null,
  img_roof: null,
  img_tyre_1: null,
  img_tyre_2: null,
  img_tyre_3: null,
  img_tyre_4: null,
  img_tyre_optional: null,
  
  // Engine Images/Videos
  img_insp_engine_assembly: null,
  img_insp_battery: null,
  img_insp_engine_oil: null,
  img_insp_engine_oil_level: null,
  img_insp_coolant: null,
  video_insp_engine_sound: null,
  video_insp_engine_smoke: null,
  video_insp_blowby: null,
};
