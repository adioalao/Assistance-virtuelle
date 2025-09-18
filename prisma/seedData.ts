import bcrypt from 'bcryptjs'
import prisma from '../src/lib/prisma';

export async function main() {
   try {
      // Insert roles
      await prisma.role.createMany({
         data: [
            { id: 1, name: 'user' },
            { id: 2, name: 'admin' },
            { id: 3, name: 'superAdmin' }
         ],
         skipDuplicates: true
      })

      console.log('✅ Roles inserted')

      // Insert users
      await prisma.user.createMany({
         data: [
            {
               name: 'Bob Martin',
               username: 'bob',
               email: 'bob@user.com',
               password: await bcrypt.hash('bob', 10),
               roleId: 1,
               createdAt: new Date(),
               updateAt: new Date()
            },
            {
               name: 'Alice Dupont',
               username: 'alice',
               email: 'alice@admin.com',
               password: await bcrypt.hash('alice', 10),
               roleId: 2,
               createdAt: new Date(),
               updateAt: new Date()
            }
         ],
         skipDuplicates: true
      })

      console.log('✅ Users inserted')

      // Insert FAQ groups
      await prisma.faqGroup.createMany({
         data: [
            { id: 1, title: 'Importation de marchandises', createdAt: new Date(), updatedAt: new Date() },
            { id: 2, title: 'Exportation de marchandises', createdAt: new Date(), updatedAt: new Date() },
            { id: 3, title: 'Procédures douanières', createdAt: new Date(), updatedAt: new Date() },
            { id: 4, title: 'Accès et sécurité du port', createdAt: new Date(), updatedAt: new Date() }
         ],
         skipDuplicates: true
      })

      console.log('✅ FAQ Groups inserted')

      // Insert questions
      await prisma.question.createMany({
         data: [
            {
               id: 1,
               content: 'Quels sont les documents requis pour importer des marchandises au port de Cotonou ?',
               status: 'approved',
               order: 1,
               faqGroupId: 1,
               parentId: null,
               userId: 1
            },
            {
               id: 2,
               content: 'Faut-il une déclaration anticipée ?',
               status: 'approved',
               order: 1,
               faqGroupId: 1,
               parentId: 1,
               userId: 2
            },
            {
               id: 3,
               content: 'Quelles sont les taxes à payer à l\'importation ?',
               status: 'approved',
               order: 2,
               faqGroupId: 1,
               parentId: 1,
               userId: 1
            },
            {
               id: 4,
               content: 'Comment exporter des marchandises via le port de Cotonou ?',
               status: 'approved',
               order: 1,
               faqGroupId: 2,
               parentId: null,
               userId: 2
            },
            {
               id: 5,
               content: 'Quels sont les délais de traitement ?',
               status: 'approved',
               order: 1,
               faqGroupId: 2,
               parentId: 4,
               userId: 1
            },
            {
               id: 6,
               content: 'Peut-on exporter des produits agricoles ?',
               status: 'approved',
               order: 2,
               faqGroupId: 2,
               parentId: 4,
               userId: 2
            },
            {
               id: 7,
               content: 'Quelles sont les formalités douanières obligatoires ?',
               status: 'approved',
               order: 1,
               faqGroupId: 3,
               parentId: null,
               userId: 1
            },
            {
               id: 8,
               content: 'Comment fonctionne le système SYDONIA ?',
               status: 'approved',
               order: 1,
               faqGroupId: 3,
               parentId: 7,
               userId: 2
            },
            {
               id: 9,
               content: 'Peut-on effectuer une pré-déclaration en ligne ?',
               status: 'approved',
               order: 2,
               faqGroupId: 3,
               parentId: 7,
               userId: 1
            },
            {
               id: 10,
               content: 'Qui peut accéder au port de Cotonou ?',
               status: 'approved',
               order: 1,
               faqGroupId: 4,
               parentId: null,
               userId: 2
            },
            {
               id: 11,
               content: 'Quels sont les horaires d\'ouverture du port ?',
               status: 'approved',
               order: 2,
               faqGroupId: 4,
               parentId: null,
               userId: 1
            },
            {
               id: 12,
               content: 'Y a-t-il des zones interdites ?',
               status: 'approved',
               order: 1,
               faqGroupId: 4,
               parentId: 10,
               userId: 2
            },
            {
               id: 13,
               content: 'Combien coûte la TVA',
               status: 'approved',
               order: 1,
               faqGroupId: 1,
               parentId: 3,
               userId: 2
            },
            {
               id: 14,
               content: 'Combien coûte les frais de douane',
               status: 'approved',
               order: 1,
               faqGroupId: 1,
               parentId: 3,
               userId: 2
            }
         ],
         skipDuplicates: true
      })

      console.log('✅ Questions inserted')

      // Insert answers one by one to avoid potential issues
      const answers = [
         {
            questionId: 1,
            content: 'Les documents requis incluent la facture commerciale, le connaissement, le certificat d\'origine et la déclaration en douane.'
         },
         {
            questionId: 2,
            content: 'Oui, une déclaration anticipée est fortement recommandée pour accélérer le processus.'
         },
         {
            questionId: 3,
            content: 'Les taxes incluent les droits de douane, la TVA et éventuellement d\'autres frais selon le type de marchandise.'
         },
         {
            questionId: 4,
            content: 'Pour exporter, il faut enregistrer les marchandises auprès des douanes, obtenir une autorisation d\'exportation et réserver un créneau logistique.'
         },
         {
            questionId: 5,
            content: 'Les délais varient entre 2 et 5 jours selon le type de marchandise.'
         },
         {
            questionId: 6,
            content: 'Oui, les produits agricoles peuvent être exportés sous certaines conditions phytosanitaires.'
         },
         {
            questionId: 7,
            content: 'Il faut une déclaration douanière, un passage au scanner, et le paiement des droits et taxes.'
         },
         {
            questionId: 8,
            content: 'SYDONIA est le système informatisé de gestion des déclarations douanières utilisé par le Port Autonome de Cotonou.'
         },
         {
            questionId: 9,
            content: 'Oui, via le portail en ligne des douanes béninoises.'
         },
         {
            questionId: 10,
            content: 'Seuls les détenteurs de badge sécurisé, les employés autorisés et les transporteurs enregistrés peuvent accéder au port.'
         },
         {
            questionId: 11,
            content: 'Le port fonctionne 24h/24, mais certaines activités sont limitées les week-ends.'
         },
         {
            questionId: 12,
            content: 'Oui, certaines zones sont réservées aux douanes et à la logistique militaire.'
         },
         {
            questionId: 13,
            content: 'La TVA est égale à 18% du prix du produit'
         },
         {
            questionId: 14,
            content: 'Cela varie en fonction de la période et du produit concerné'
         }
      ];

      await prisma.answer.createMany({
         data: answers,
         skipDuplicates: true
      });

      console.log('✅ Answers inserted')
      console.log('✅ Seed data completed successfully')
   } catch (error) {
      console.error('❌ Error seeding data:', error)
      throw error
   }
}

if (require.main === module) {
   main()
      .then(async () => {
         await prisma.$disconnect()
      })
      .catch(async (e) => {
         console.error(e)
         await prisma.$disconnect()
         process.exit(1)
      })
}