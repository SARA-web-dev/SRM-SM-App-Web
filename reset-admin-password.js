const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function resetAdminPassword() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_stages'
  });

  try {
    // Nouveau mot de passe temporaire
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('Nouveau hash bcrypt:', hashedPassword);

    // Mettre à jour le mot de passe
    const [result] = await connection.execute(
      'UPDATE administrateur SET motDePasse = ? WHERE email = ?',
      [hashedPassword, 'admin@srm-sm.ma']
    );

    if (result.affectedRows > 0) {
      console.log(`✅ Mot de passe admin mis à jour avec succès !`);
      console.log(`📧 Email: admin@srm-sm.ma`);
      console.log(`🔑 Nouveau mot de passe: ${newPassword}`);
    } else {
      console.log('❌ Aucun administrateur trouvé avec cet email');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await connection.end();
    console.log('🔒 Connexion à la base de données fermée');
  }
}

resetAdminPassword();