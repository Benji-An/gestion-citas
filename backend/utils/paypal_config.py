"""
Configuración de PayPal SDK
"""
import paypalrestsdk
from config import settings

# Configurar PayPal con credenciales
# NOTA: Usa las credenciales del sandbox para desarrollo
paypalrestsdk.configure({
    "mode": settings.PAYPAL_MODE,  # sandbox o live
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET
})


def crear_pago_paypal(monto, descripcion, return_url, cancel_url):
    """
    Crea un pago en PayPal
    
    Args:
        monto: Monto en pesos colombianos (se convertirá a USD)
        descripcion: Descripción del pago
        return_url: URL de retorno al completar el pago
        cancel_url: URL de cancelación
    
    Returns:
        dict: Información del pago creado
    """
    # Convertir COP a USD (tasa aproximada: 1 USD = 4000 COP)
    # En producción, usar una API de conversión real
    monto_usd = round(monto / 4000, 2)
    
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": return_url,
            "cancel_url": cancel_url
        },
        "transactions": [{
            "amount": {
                "total": str(monto_usd),
                "currency": "USD"
            },
            "description": descripcion
        }]
    })
    
    if payment.create():
        return {
            "success": True,
            "payment_id": payment.id,
            "approval_url": next(link.href for link in payment.links if link.rel == "approval_url"),
            "monto_usd": monto_usd,
            "monto_cop": monto
        }
    else:
        return {
            "success": False,
            "error": payment.error
        }


def ejecutar_pago_paypal(payment_id, payer_id):
    """
    Ejecuta un pago de PayPal después de la aprobación del usuario
    
    Args:
        payment_id: ID del pago de PayPal
        payer_id: ID del pagador
    
    Returns:
        dict: Resultado de la ejecución
    """
    payment = paypalrestsdk.Payment.find(payment_id)
    
    if payment.execute({"payer_id": payer_id}):
        return {
            "success": True,
            "payment_id": payment.id,
            "state": payment.state,
            "transactions": payment.transactions
        }
    else:
        return {
            "success": False,
            "error": payment.error
        }


def obtener_pago_paypal(payment_id):
    """
    Obtiene los detalles de un pago de PayPal
    
    Args:
        payment_id: ID del pago
    
    Returns:
        dict: Detalles del pago
    """
    try:
        payment = paypalrestsdk.Payment.find(payment_id)
        return {
            "success": True,
            "id": payment.id,
            "state": payment.state,
            "create_time": payment.create_time,
            "transactions": payment.transactions
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
