import asyncio
import logging
import aiohttp
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

BOT_TOKEN = "8485668772:AAHtZ7AdlOZrV0cn9Ae5YdUWJP24f7SMf1k"
API_URL = "http://127.0.0.1:8000/api"  # Production: https://organikbuyurtma.uz/api

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


async def save_user_to_db(user: types.User):
    """Foydalanuvchini Django bazasiga saqlash"""
    data = {
        'user_id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'language_code': user.language_code
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{API_URL}/telegram-users/", json=data) as response:
                if response.status in [200, 201]:
                    logging.info(f"User {user.id} saved to database")
                else:
                    logging.warning(f"Failed to save user {user.id}: {response.status}")
    except Exception as e:
        logging.error(f"Error saving user to database: {e}")


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    # Foydalanuvchini bazaga saqlash
    await save_user_to_db(message.from_user)
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🛒 Buyurtma berish",
                url="https://organikbuyurtma.uz"
            )
        ]
    ])
    
    welcome_text = (
        "Assalomu alaykum! 🌿\n\n"
        "Organic Store mahsulotlarini \"Buyurtma berish\" tugmasi orqali "
        "oson va qulay tarzda xarid qilishingiz mumkin.\n\n"
        "Marhamat👇"
    )
    
    await message.answer(welcome_text, reply_markup=keyboard)


async def main():
    """Botni ishga tushirish"""
    print("Bot ishga tushdi...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
