<?php
// public/api/booking.php - File-based version (no database needed)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'booking_date', 'service'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Missing required fields',
        'missing_fields' => $missing_fields
    ]);
    exit;
}

// Sanitize input data
$booking_data = [
    'id' => uniqid(),
    'name' => htmlspecialchars(trim($input['name'])),
    'email' => filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL),
    'phone' => isset($input['phone']) ? htmlspecialchars(trim($input['phone'])) : '',
    'booking_date' => htmlspecialchars(trim($input['booking_date'])),
    'booking_time' => isset($input['booking_time']) ? htmlspecialchars(trim($input['booking_time'])) : '',
    'service' => htmlspecialchars(trim($input['service'])),
    'message' => isset($input['message']) ? htmlspecialchars(trim($input['message'])) : '',
    'status' => 'pending',
    'created_at' => date('Y-m-d H:i:s')
];

// Validate email
if (!$booking_data['email']) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

try {
    // Create bookings directory if it doesn't exist
    $bookings_dir = 'bookings';
    if (!is_dir($bookings_dir)) {
        mkdir($bookings_dir, 0755, true);
    }
    
    // Save booking to JSON file
    $filename = $bookings_dir . '/booking_' . date('Y-m-d_H-i-s') . '_' . $booking_data['id'] . '.json';
    $json_data = json_encode($booking_data, JSON_PRETTY_PRINT);
    
    if (file_put_contents($filename, $json_data)) {
        // Also append to a master CSV file for easy viewing
        $csv_file = $bookings_dir . '/all_bookings.csv';
        $csv_row = [
            $booking_data['created_at'],
            $booking_data['name'],
            $booking_data['email'],
            $booking_data['phone'],
            $booking_data['booking_date'],
            $booking_data['booking_time'],
            $booking_data['service'],
            $booking_data['message'],
            $booking_data['status']
        ];
        
        // Add header if file doesn't exist
        if (!file_exists($csv_file)) {
            $header = ['Created At', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Message', 'Status'];
            $fp = fopen($csv_file, 'w');
            fputcsv($fp, $header);
            fputcsv($fp, $csv_row);
            fclose($fp);
        } else {
            $fp = fopen($csv_file, 'a');
            fputcsv($fp, $csv_row);
            fclose($fp);
        }
        
        // Send notification email (optional)
        $to = 'your-email@yourdomain.com'; // Replace with your email
        $subject = 'New Booking Received';
        $email_message = "New booking received:\n\n";
        $email_message .= "Name: {$booking_data['name']}\n";
        $email_message .= "Email: {$booking_data['email']}\n";
        $email_message .= "Phone: {$booking_data['phone']}\n";
        $email_message .= "Service: {$booking_data['service']}\n";
        $email_message .= "Date: {$booking_data['booking_date']}\n";
        $email_message .= "Time: {$booking_data['booking_time']}\n";
        $email_message .= "Message: {$booking_data['message']}\n";
        
        $headers = "From: noreply@yourdomain.com\r\n";
        mail($to, $subject, $email_message, $headers);
        
        // Return success response
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking_id' => $booking_data['id']
        ]);
    } else {
        throw new Exception('Failed to save booking');
    }
    
} catch (Exception $e) {
    error_log("Booking API Error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'An error occurred',
        'message' => 'Please try again later',
        'debug' => $e->getMessage()
    ]);
}
?>