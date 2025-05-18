<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'salary' => 'nullable|numeric',
            'joining_date' => 'nullable|date',
        ]);

        $validated['role'] = 'employee'; // default role
        $validated['password'] = bcrypt($validated['password']);

        $employee = User::create($validated);

        return response()->json($employee, 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Something went wrong.',
            'message' => $e->getMessage()
        ], 500);
    }
}

    // 4. Update employee
    public function update(Request $request, $id)
    {
        $employee = User::where('role', 'employee')->findOrFail($id);

        $fields = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $employee->id,
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'salary' => 'nullable|numeric',
            'password' => 'nullable|min:6',
        ]);

        // Update password if provided
        if (isset($fields['password'])) {
            $fields['password'] = Hash::make($fields['password']);
        }

        $employee->update($fields);

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
