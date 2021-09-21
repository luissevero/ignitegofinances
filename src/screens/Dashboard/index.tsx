import React from 'react'
import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGretting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList
} from './styles'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

export interface DataListProps extends TransactionCardProps {
    id: string
}

export function Dashboard(){

    const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Desenvolvimento de site",
            amount: "R$ 12,000.00",
            category: {
                name: 'Vendas',
                icon: 'dollar-sign',
            },
            date: "07/09/2021"
            
        },
        {
            id: '2',
            title: "Hamburgueria Pizza",
            amount: "R$ 59.00",
            category: {
                name: 'Alimentação',
                icon: 'coffee'
            },
            date: "11/09/2021",
            type: 'negative',
            
        },
        {
            id: '3',
            title: "Aluguel do Apartamento",
            amount: "R$ 1,200.00",
            category: {
                name: 'Casa',
                icon: 'shopping-bag'
            },
            date: "19/09/2021",
            type: 'negative'            
        }
    ]

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>    
                        <Photo 
                            source={{uri: 'https://gravatar.com/avatar/871311f79fdcb7aaf05782c3f759fd00?s=400&d=robohash&r=x'}}
                        />
                        <User>
                            <UserGretting>Olá, </UserGretting>
                            <UserName>Luis</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power"/> 
                </UserWrapper>
            </Header>
            <HighlightCards>
                <HighlightCard 
                    title='Entradas'
                    amount='R$15.000,00'
                    lastTransaction='Última transação em 20 de setembro'
                    type='up'
                />
                <HighlightCard 
                    title='Saídas'
                    amount='R$4,000.00'
                    lastTransaction='Última transação em 11 de setembro'
                    type='down'
                />
                <HighlightCard 
                    title='Total'
                    amount='R$11,000.00'
                    lastTransaction='Última transação em 20 de setembro'
                    type='total'
                />
                
            </HighlightCards>
            <Transactions>
                <Title>Listagem</Title>

                <TransactionList 
                    keyExtractor={item => item.id}
                    data={data}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

                

            </Transactions>

           

        </Container>
    )
}