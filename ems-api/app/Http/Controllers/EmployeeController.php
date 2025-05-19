<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    // 1. Show all employees (for admin)
    public function index()
    {
        return response()->json(User::where('role', 'employee')->get(), 200);
    }

    // 2. Show single employee
    public function show($id)
    {
        $employee = User::where('role', 'employee')->findOrFail($id);
        return response()->json($employee, 200);
    }

    // 3. Add a new employee (Admin only)

public function store(Request $request)
{
    try {
        Log::info('🚀 Entered store() method.');

        // Step 1: Manually validate the request so we can handle errors cleanly
        Log::info('🛡️ Validating request data...', ['request' => $request->all()]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'salary' => 'nullable|numeric|min:0',
            'joining_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            Log::warning('❌ Validation failed.', ['errors' => $errors]);

            // Custom error for duplicate email
            if ($errors->has('email') && str_contains($errors->first('email'), 'has already been taken')) {
                return response()->json([
                    'error' => 'Email already exists.',
                    'messages' => $errors,
                ], 409); // Conflict
            }

            return response()->json([
                'error' => 'Validation failed.',
                'messages' => $errors,
            ], 422); // Unprocessable Entity
        }

        $validated = $validator->validated();

        // Step 2: Add additional fields
        $validated['role'] = 'employee';
        $validated['password'] = Hash::make($validated['password']);

        Log::info('🧾 Data ready for DB insert.', ['data' => $validated]);

        // Step 3: Create employee
        $employee = User::create($validated);

        Log::info('🎉 User created successfully.', ['user' => $employee]);

        return response()->json($employee, 201);

    } catch (QueryException $e) {
        Log::error('💥 Database error: ' . $e->getMessage());
        return response()->json([
            'error' => 'Database error.',
            'message' => 'A database error occurred while saving the employee.',
        ], 500);

    } catch (\Exception $e) {
        Log::error('🔥 Unexpected server error: ' . $e->getMessage());
        return response()->json([
            'error' => 'Server error.',
            'message' => $e->getMessage(), // Optional: for debugging
        ], 500);
    }
}


    // 4. Update employee
public function update(Request $request, $id)
{
    $employee = User::where('role', 'employee')->where('id', $id)->firstOrFail();

    $fields = $request->validate([
        'name' => 'nullable|string|max:255',
        'email' => 'nullable|email|unique:users,email,' . $employee->id,
        'department' => 'nullable|string|max:255',
        'designation' => 'nullable|string|max:255',
        'joining_date' => 'nullable|date',
        'salary' => 'nullable|numeric',
        'password' => 'nullable|min:6',
    ]);

    if (!empty($fields['password'])) {
        $fields['password'] = Hash::make($fields['password']);
    } else {
        unset($fields['password']);
    }

    $employee->update($fields);
    $employee->refresh();

    return response()->json($employee, 200);
}

    // 5. Delete employee
    public function destroy($id)
    {
        $employee = User::where('role', 'employee')->findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully'], 200);
    }
}
