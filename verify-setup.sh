#!/bin/bash

# ============================================================
# VERIFICATION SCRIPT - Configuration API Setup
# ============================================================
# Ce script vérifie que toute la configuration est correcte

echo "================================"
echo "🔍 VERIFICATION SETUP API"
echo "================================"
echo ""

errors=0

# ============================================================
# 1. Vérifier les fichiers .env
# ============================================================
echo "1️⃣  Vérification des fichiers .env..."
echo ""

if [ -f "admin/.env" ]; then
    echo "   ✅ admin/.env existe"
    if grep -q "VITE_API_BASE_URL" "admin/.env"; then
        echo "     ✅ VITE_API_BASE_URL configuré"
    else
        echo "     ⚠️  VITE_API_BASE_URL manquant"
        ((errors++))
    fi
else
    echo "   ⚠️  admin/.env MANQUANT"
    echo "     💡 Exécutez: cp admin/.env.example admin/.env"
    ((errors++))
fi
echo ""

if [ -f "Client/.env" ]; then
    echo "   ✅ Client/.env existe"
    if grep -q "VITE_API_BASE_URL" "Client/.env"; then
        echo "     ✅ VITE_API_BASE_URL configuré"
    else
        echo "     ⚠️  VITE_API_BASE_URL manquant"
        ((errors++))
    fi
else
    echo "   ⚠️  Client/.env MANQUANT"
    echo "     💡 Exécutez: cp Client/.env.example Client/.env"
    ((errors++))
fi
echo ""

if [ -f "supplier/.env" ]; then
    echo "   ✅ supplier/.env existe"
    if grep -q "VITE_API_BASE_URL" "supplier/.env"; then
        echo "     ✅ VITE_API_BASE_URL configuré"
    else
        echo "     ⚠️  VITE_API_BASE_URL manquant"
        ((errors++))
    fi
else
    echo "   ⚠️  supplier/.env MANQUANT"
    echo "     💡 Exécutez: cp supplier/.env.example supplier/.env"
    ((errors++))
fi
echo ""

# ============================================================
# 2. Vérifier les fichiers config
# ============================================================
echo "2️⃣  Vérification des fichiers config..."
echo ""

if [ -f "admin/app/config.js" ]; then
    echo "   ✅ admin/app/config.js existe"
else
    echo "   ⚠️  admin/app/config.js MANQUANT"
    ((errors++))
fi
echo ""

if [ -f "Client/app/config.js" ]; then
    echo "   ✅ Client/app/config.js existe"
else
    echo "   ⚠️  Client/app/config.js MANQUANT"
    ((errors++))
fi
echo ""

if [ -f "supplier/src/config.ts" ]; then
    echo "   ✅ supplier/src/config.ts existe"
else
    echo "   ⚠️  supplier/src/config.ts MANQUANT"
    ((errors++))
fi
echo ""

# ============================================================
# 3. Vérifier les services
# ============================================================
echo "3️⃣  Vérification des services Admin..."
echo ""

admin_services=(
    "admin/app/services/productService.js"
    "admin/app/services/userService.js"
    "admin/app/services/supplierService.js"
    "admin/app/services/orderService.js"
    "admin/app/services/dashboardService.js"
    "admin/app/services/ImageUploadService.js"
)

for service in "${admin_services[@]}"; do
    if [ -f "$service" ]; then
        if grep -q "import config from '../config'" "$service"; then
            echo "   ✅ $(basename $service) - utilise config"
        else
            echo "   ⚠️  $(basename $service) - n'importe pas config"
            ((errors++))
        fi
    else
        echo "   ❌ $service MANQUANT"
        ((errors++))
    fi
done
echo ""

echo "4️⃣  Vérification des services Client..."
echo ""

client_services=(
    "Client/app/services/authService.js"
    "Client/app/services/livreurService.js"
    "Client/app/services/productService.js"
    "Client/app/services/orderService.js"
)

for service in "${client_services[@]}"; do
    if [ -f "$service" ]; then
        if grep -q "import config from '../config'" "$service"; then
            echo "   ✅ $(basename $service) - utilise config"
        else
            echo "   ⚠️  $(basename $service) - n'importe pas config"
            ((errors++))
        fi
    else
        echo "   ❌ $service MANQUANT"
        ((errors++))
    fi
done
echo ""

# ============================================================
# 4. Vérifier la documentation
# ============================================================
echo "5️⃣  Vérification de la documentation..."
echo ""

if [ -f "CONFIG_SETUP.md" ]; then
    echo "   ✅ CONFIG_SETUP.md - Guide de configuration"
else
    echo "   ⚠️  CONFIG_SETUP.md MANQUANT"
fi

if [ -f "SETUP_SUMMARY.md" ]; then
    echo "   ✅ SETUP_SUMMARY.md - Résumé des changements"
else
    echo "   ⚠️  SETUP_SUMMARY.md MANQUANT"
fi

if [ -f "SERVICES_EXAMPLES.jsx" ]; then
    echo "   ✅ SERVICES_EXAMPLES.jsx - Exemples d'utilisation"
else
    echo "   ⚠️  SERVICES_EXAMPLES.jsx MANQUANT"
fi
echo ""

# ============================================================
# 5. Résumé final
# ============================================================
echo "================================"
if [ $errors -eq 0 ]; then
    echo "✅ TOUT EST OK!"
    echo "================================"
    echo ""
    echo "🚀 Prochaines étapes:"
    echo "   1. Assurez-vous que le backend Laravel tourne: http://localhost:8000"
    echo "   2. Vérifiez que .env pointe vers la bonne URL API"
    echo "   3. Testez un service dans la console du navigateur:"
    echo "      - Admin: productService.list()"
    echo "      - Client: productService.getPublicProducts()"
    echo "   4. Vérifiez les logs console pour les erreurs API"
    echo ""
else
    echo "⚠️  IL Y A $errors PROBLEME(S)"
    echo "================================"
    echo ""
    echo "Consultez le message ci-dessus et corrigez les problèmes."
    echo ""
fi

exit $errors
