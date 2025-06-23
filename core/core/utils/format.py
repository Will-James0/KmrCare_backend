

def format_user_registration(data):
    return f"""
    <html>
        <body>
            <h2> Demande d'inscription reçue</h2>
            <p>Bonjour {data['first_name']} {data['last_name']},</p>
            <p>Merci d'avoir soumis votre demande d'inscription. Nous l'examinerons dans les plus brefs délais.</p>
        </body>
    </html>
    """.strip()


def format_registration_email(data):
    return f"""
    <html>
        <body>
            <h2>📋 Nouvelle demande d'inscription</h2>

            <h3>👤 Utilisateur</h3>
            <ul>
                <li><strong>Prénom :</strong> {data['first_name']}</li>
                <li><strong>Nom :</strong> {data['last_name']}</li>
                <li><strong>Email :</strong> {data['email']}</li>
                <li><strong>Nom d'utilisateur :</strong> {data['username']}</li>
            </ul>

            <h3>🏥 Dispensaire</h3>
            <ul>
                <li><strong>Nom :</strong> {data['dispensary_name']}</li>
                <li><strong>Spécialités :</strong> {data['dispensary_specialities']}</li>
                <li><strong>Quartier :</strong> {data['dispensary_quarter']}</li>
                <li><strong>Localisation :</strong> {data['dispensary_localisation']}</li>
                <li><strong>Téléphone :</strong> {data.get('dispensary_phone') or 'Non renseigné'}</li>
                <li><strong>Email :</strong> {data.get('dispensary_email') or 'Non renseigné'}</li>
                <li><strong>Horaires :</strong> {data['dispensary_opening']} - {data['dispensary_ending']}</li>
            </ul>
        </body>
    </html>
    """.strip()
    

def formation_registration_accepted():
    return """
    <html>
        <body>
            <h2>✅ Votre demande d'inscription a été acceptée !</h2>
            <p>Vous pouvez maintenant vous connecter à votre compte.</p>
            <p>Merci de votre patience et à bientôt !</p>
        </body>
    </html>
    """.strip()

    
def format_registration_rejected():
    return """
    <html>
        <body>
            <h2>❌ Votre demande d'inscription a été rejetée</h2>
            <p>Nous sommes désolés, mais votre demande n'a pas été acceptée.</p>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        </body>
    </html>
    """.strip()