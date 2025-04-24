# Guide de Test des Endpoints API avec Postman

## Configuration initiale

1. Créez une nouvelle collection dans Postman nommée "CNID Guinée API"
2. Configurez une variable d'environnement :
   - Créez un nouvel environnement (ex: "CNID Dev")
   - Ajoutez une variable `BASE_URL` avec la valeur `http://localhost:8000`
   - Ajoutez une variable `TOKEN` (elle sera automatiquement remplie après l'authentification)

## Authentification

### 1. Obtenir un token JWT

```
POST {{BASE_URL}}/api/auth/token/
Content-Type: application/json

{
    "username": "votre_username",
    "password": "votre_password"
}
```

Réponse attendue (200 OK) :
```json
{
    "access": "token...",
    "refresh": "token..."
}
```

### 2. Rafraîchir le token

```
POST {{BASE_URL}}/api/auth/token/refresh/
Content-Type: application/json

{
    "refresh": "votre_refresh_token"
}
```

## Tests des Endpoints

### Citoyens

1. Liste des citoyens
```
GET {{BASE_URL}}/api/auth/citoyens/
Authorization: Bearer {{TOKEN}}
```

2. Créer un citoyen
```
POST {{BASE_URL}}/api/auth/citoyens/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "nin": "123456789",
    "utilisateur": {
        "username": "citoyen1",
        "email": "citoyen1@example.com",
        "password": "password123",
        "telephone": "+224123456789",
        "type_utilisateur": "citoyen"
    },
    "date_naissance": "1990-01-01",
    "lieu_naissance": "Conakry",
    "sexe": "M",
    "nationalite": "Guinéenne",
    "situation_matrimoniale": "celibataire",
    "pere_nom": "Nom du père",
    "mere_nom": "Nom de la mère",
    "profession": "Ingénieur",
    "adresse": "Conakry, Guinée"
}
```

3. Détails d'un citoyen
```
GET {{BASE_URL}}/api/auth/citoyens/{id}/
Authorization: Bearer {{TOKEN}}
```

4. Modifier un citoyen
```
PUT {{BASE_URL}}/api/auth/citoyens/{id}/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    // Mêmes champs que pour la création
}
```

5. Supprimer un citoyen
```
DELETE {{BASE_URL}}/api/auth/citoyens/{id}/
Authorization: Bearer {{TOKEN}}
```

### Agents

1. Liste des agents
```
GET {{BASE_URL}}/api/auth/agents/
Authorization: Bearer {{TOKEN}}
```

2. Créer un agent
```
POST {{BASE_URL}}/api/auth/agents/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "utilisateur": {
        "username": "agent1",
        "email": "agent1@example.com",
        "password": "password123",
        "telephone": "+224123456789",
        "type_utilisateur": "agent"
    },
    "matricule": "AGT001",
    "poste": "Agent d'enregistrement",
    "bureau": "Conakry Centre"
}
```

3. Détails d'un agent
```
GET {{BASE_URL}}/api/auth/agents/{id}/
Authorization: Bearer {{TOKEN}}
```

4. Modifier un agent
```
PUT {{BASE_URL}}/api/auth/agents/{id}/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    // Mêmes champs que pour la création
}
```

5. Supprimer un agent
```
DELETE {{BASE_URL}}/api/auth/agents/{id}/
Authorization: Bearer {{TOKEN}}
```

### Administrateurs

1. Liste des administrateurs
```
GET {{BASE_URL}}/api/auth/administrateurs/
Authorization: Bearer {{TOKEN}}
```

2. Créer un administrateur
```
POST {{BASE_URL}}/api/auth/administrateurs/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "utilisateur": {
        "username": "admin1",
        "email": "admin1@example.com",
        "password": "password123",
        "telephone": "+224123456789",
        "type_utilisateur": "admin"
    },
    "niveau_acces": "super_admin",
    "departement": "Direction Générale"
}
```

3. Détails d'un administrateur
```
GET {{BASE_URL}}/api/auth/administrateurs/{id}/
Authorization: Bearer {{TOKEN}}
```

4. Modifier un administrateur
```
PUT {{BASE_URL}}/api/auth/administrateurs/{id}/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    // Mêmes champs que pour la création
}
```

5. Supprimer un administrateur
```
DELETE {{BASE_URL}}/api/auth/administrateurs/{id}/
Authorization: Bearer {{TOKEN}}
```

### Extraits de Naissance

1. Liste des extraits
```
GET {{BASE_URL}}/api/auth/extraits/
Authorization: Bearer {{TOKEN}}
```

2. Créer un extrait
```
POST {{BASE_URL}}/api/auth/extraits/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "nom": "Nom",
    "prenom": "Prénom",
    "date_naissance": "1990-01-01",
    "lieu_naissance": "Conakry",
    "citoyen": 1,
    "numero_extrait": "EXT001",
    "date_delivrance": "2023-01-01",
    "lieu_delivrance": "Conakry"
}
```

3. Détails d'un extrait
```
GET {{BASE_URL}}/api/auth/extraits/{id}/
Authorization: Bearer {{TOKEN}}
```

4. Modifier un extrait
```
PUT {{BASE_URL}}/api/auth/extraits/{id}/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    // Mêmes champs que pour la création
}
```

5. Supprimer un extrait
```
DELETE {{BASE_URL}}/api/auth/extraits/{id}/
Authorization: Bearer {{TOKEN}}
```

### Demandes

1. Liste des demandes
```
GET {{BASE_URL}}/api/auth/demandes/
Authorization: Bearer {{TOKEN}}
```

2. Créer une demande
```
POST {{BASE_URL}}/api/auth/demandes/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "citoyen": 1,
    "type_demande": "nouvelle_carte",
    "extrait": 1,
    "statut": "en_attente",
    "date_demande": "2024-01-15",
    "commentaire": "Première demande de carte"
}
```

3. Détails d'une demande
```
GET {{BASE_URL}}/api/auth/demandes/{id}/
Authorization: Bearer {{TOKEN}}
```

4. Modifier une demande
```
PUT {{BASE_URL}}/api/auth/demandes/{id}/
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    // Mêmes champs que pour la création
}
```

5. Supprimer une demande
```
DELETE {{BASE_URL}}/api/auth/demandes/{id}/
Authorization: Bearer {{TOKEN}}
```

## Vérification du bon fonctionnement

Pour chaque requête, vérifiez :

1. Le code de statut HTTP :
   - 200 : Succès pour GET
   - 201 : Succès pour POST
   - 204 : Succès pour DELETE
   - 400 : Erreur de validation
   - 401 : Non authentifié
   - 403 : Non autorisé
   - 404 : Ressource non trouvée

2. La structure des données :
   - Les champs requis sont présents
   - Les types de données sont corrects
   - Les relations entre les objets sont correctes

3. Les validations :
   - Essayez de créer des objets avec des données invalides
   - Vérifiez les contraintes d'unicité
   - Testez les permissions selon le type d'utilisateur

4. L'authentification :
   - Vérifiez que les endpoints protégés nécessitent un token valide
   - Testez l'expiration du token et le rafraîchissement

Pour automatiser les tests, vous pouvez utiliser les tests Postman :

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response structure is correct", function () {
    const responseData = pm.response.json();
    pm.expect(responseData).to.be.an('object');
    pm.expect(responseData.id).to.exist;
});
```