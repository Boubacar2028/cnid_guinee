from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def envoyer_email_bienvenue(utilisateur):
    """
    Envoie un email de bienvenue à l'utilisateur nouvellement inscrit
    """
    sujet = 'Bienvenue sur CNID Guinée - Confirmation de création de compte'
    expediteur = settings.DEFAULT_FROM_EMAIL
    destinataire = utilisateur.email
    
    # Créer le contenu HTML de l'email
    contenu_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur CNID Guinée</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #034694;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }}
            .content {{
                background-color: #f9f9f9;
                padding: 20px;
                border-left: 1px solid #ddd;
                border-right: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                border-radius: 0 0 5px 5px;
            }}
            .footer {{
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }}
            .button {{
                display: inline-block;
                background-color: #034694;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 15px;
            }}
            h1 {{
                color: #034694;
                margin-top: 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>CNID GUINÉE</h2>
            </div>
            <div class="content">
                <h1>Bienvenue, {utilisateur.first_name} {utilisateur.last_name}!</h1>
                <p>Nous sommes ravis de vous accueillir sur la plateforme officielle de la Carte Nationale d'Identité de Guinée.</p>
                <p>Votre compte a été créé avec succès. Vous pouvez maintenant accéder à tous nos services en ligne :</p>
                <ul>
                    <li>Effectuer une demande de carte nationale d'identité</li>
                    <li>Suivre l'état d'avancement de votre demande</li>
                    <li>Prendre rendez-vous pour la biométrie</li>
                    <li>Consulter vos documents</li>
                </ul>
                <p>Pour toute question ou assistance, n'hésitez pas à contacter notre service client.</p>
                
                <a href="https://cnid.gouv.gn" class="button">Accéder à votre espace</a>
                
                <p>Cordialement,<br>
                L'équipe CNID Guinée</p>
            </div>
            <div class="footer">
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                <p>© 2025 CNID Guinée - Tous droits réservés</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Version texte simple
    contenu_texte = strip_tags(contenu_html)
    
    # Créer l'email
    email = EmailMultiAlternatives(
        subject=sujet,
        body=contenu_texte,
        from_email=expediteur,
        to=[destinataire]
    )
    
    # Ajouter la version HTML
    email.attach_alternative(contenu_html, "text/html")
    
    # Envoyer l'email
    try:
        email.send()
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {e}")
        return False
