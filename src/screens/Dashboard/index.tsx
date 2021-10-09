import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'styled-components'

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
    TransactionList,
    LoadContainer
} from './styles'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

export interface DataListProps extends TransactionCardProps {
    id: string
}

interface HighlightProps {
    amount: string
    lastTransaction: string
}

interface HighlightData {
    entries: HighlightProps
    expensives: HighlightProps
    total: HighlightProps
}

export function Dashboard(){

    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData]= useState<HighlightData>({} as HighlightData)

    const theme = useTheme()

    function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){

        const lastTransaction = Math.max.apply(Math, collection
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime()))
        

        return Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(lastTransaction))
    }

    async function loadTransactions(){
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : []

        let entriesSum = 0
        let expensiveSum = 0

        const transactionsFormatted: DataListProps[] = transactions.map( (transaction: DataListProps) => {
            
            //somar os valores positivos e negativos
            if(transaction.type === 'positive'){
                entriesSum += Number(transaction.amount)
            }else{
                expensiveSum += Number(transaction.amount)
            }

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

        
        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative')
        const lastTransactionTotal = `${new Date(lastTransactionExpensives).getDay()} de ${new Date(lastTransactionExpensives).toLocaleString('pt-BR', {month: 'long'})}`

        setHighlightData({
            entries: {
                amount: entriesSum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionEntries
            },
            expensives: {
                amount: expensiveSum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionExpensives
            },
            total: {
                amount: (entriesSum - expensiveSum).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: `01 a ${lastTransactionTotal}`
            }
        })

        setTransactions(transactionsFormatted)
        setIsLoading(false)
    }

    useEffect(() => {
       
        loadTransactions()
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            {isLoading 
                ? 
                <LoadContainer>
                    <ActivityIndicator 
                        size='large' 
                        color={theme.colors.primary} 
                    />
                </LoadContainer> 
                :
                <>
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
                        amount={highlightData.entries.amount}
                        lastTransaction={'Última entrada em ' + highlightData.entries.lastTransaction}
                        type='up'
                    />
                    <HighlightCard 
                        title='Saídas'
                        amount={highlightData.expensives.amount}
                        lastTransaction={'Última saída em ' + highlightData.expensives.lastTransaction}
                        type='down'
                    />
                    <HighlightCard 
                        title='Total'
                        amount={highlightData.total.amount}
                        lastTransaction={highlightData.total.lastTransaction}
                        type='total'
                    />
                    
                </HighlightCards>
                <Transactions>
                    <Title>Listagem</Title>

                    <TransactionList 
                        keyExtractor={item => item.id}
                        data={transactions}
                        renderItem={({ item }) => <TransactionCard data={item} />}
                    />

                    

                </Transactions>

            </>
           }

        </Container>
    )
}