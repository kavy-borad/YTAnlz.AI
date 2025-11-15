import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
const PAYMENTS_FILE = path.join(process.cwd(), 'data', 'payments.json')

// Helper function to read JSON file
function readJSONFile(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      return []
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading file:', error)
    return []
  }
}

// Helper function to write JSON file  
function writeJSONFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing file:', error)
    return false
  }
}

// GET - Get all users and payments
export async function GET() {
  try {
    const users = readJSONFile(USERS_FILE)
    const payments = readJSONFile(PAYMENTS_FILE)

    // Calculate stats
    const totalRevenue = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0)
    const totalUsers = users.length
    const freeUsers = users.filter((u: any) => u.plan === 'free' || !u.plan).length
    const proUsers = users.filter((u: any) => u.plan === 'pro').length
    const enterpriseUsers = users.filter((u: any) => u.plan === 'enterprise').length
    
    // Monthly revenue (current month)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyRevenue = payments
      .filter((p: any) => {
        const paymentDate = new Date(p.date)
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
      })
      .reduce((sum: number, payment: any) => sum + payment.amount, 0)

    const stats = {
      totalRevenue,
      totalUsers,
      freeUsers,
      proUsers,
      enterpriseUsers,
      monthlyRevenue
    }

    return NextResponse.json({
      success: true,
      users,
      payments,
      stats
    })
  } catch (error) {
    console.error('Error in GET /api/admin:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch data'
    }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Read current users
    const users = readJSONFile(USERS_FILE)
    
    // Find user to delete
    const userToDelete = users.find((u: any) => u.id === userId)
    if (!userToDelete) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Remove user from array
    const updatedUsers = users.filter((u: any) => u.id !== userId)
    
    // Save updated users
    const saveSuccess = writeJSONFile(USERS_FILE, updatedUsers)
    
    if (!saveSuccess) {
      return NextResponse.json({
        success: false,
        error: 'Failed to save updated users'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `User "${userToDelete.username}" deleted successfully`,
      deletedUser: userToDelete
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 })
  }
}