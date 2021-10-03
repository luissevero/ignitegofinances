import React, { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGretting,
    UserName,
    LogoutButton,
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

    const [data, setData] = useState<DataListProps[]>([])

    async function loadTransactions(){
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : []

        const transactionsFormatted: DataListProps[] = transactions.map( (transaction: DataListProps) => {
            const amount = Number(transaction.amount).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
            const date = new Date(transaction.date)
            const dateFormatted = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date)

            return {
                id: transaction.id,
                name: transaction.name,
                amount,
                type: transaction.type,
                category: transaction.category,
                date: dateFormatted

            }

        })

        setData(transactionsFormatted)
    }

    useEffect(() => {
       
        loadTransactions()
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

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
                    <LogoutButton onPress={() => {}}>
                        <Icon name="power"/>
                    </LogoutButton> 
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