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
import { useAuth } from '../../contexts/AuthContext'

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
    const { signOut, user } = useAuth()

    function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){

        const collectionFiltered = collection.filter(transaction => transaction.type === type)
        
        if(collectionFiltered.length === 0) return 0

        const lastTransaction = new Date(Math.max.apply(Math, collectionFiltered
            .map(transaction => new Date(transaction.date).getTime())))
        
        console.log('last transaction: ' + lastTransaction)

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}}`
    }

    async function loadTransactions(){

        const dataKey = `@gofinances:transactions_user:${user.id}`
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
        const lastTransactionTotal = lastTransactionExpensives === 0 ? 'Não há transações' : `01 a ${lastTransactionExpensives}`

        console.log(entriesSum, expensiveSum)
        setHighlightData({
            entries: {
                amount: entriesSum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionEntries === 0 ? 'Não há transações' : lastTransactionEntries
            },
            expensives: {
                amount: expensiveSum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionExpensives === 0 ? 'Não há transações' : lastTransactionExpensives
            },
            total: {
                amount: (entriesSum - expensiveSum).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionTotal
            }
        })

        setTransactions(transactionsFormatted)
        setIsLoading(false)
    }

    async function eraseTransactions(){
        await AsyncStorage.removeItem('@gofinances:user')
        await AsyncStorage.removeItem(`@gofinances:transactions_user:${user.id}`)
    }

    useEffect(() => {
       //eraseTransactions()
       loadTransactions()
       setIsLoading(false)
    }, [])

    useFocusEffect(useCallback(() => {
        //eraseTransactions()
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
                                source={{uri: user.photo}}
                            />
                            <User>
                                <UserGretting>Olá, </UserGretting>
                                <UserName>{user.name}</UserName>
                            </User>
                        </UserInfo>
                        <LogoutButton onPress={signOut}>
                            <Icon name="power"/>
                        </LogoutButton> 
                    </UserWrapper>
                </Header>
                <HighlightCards>
                    <HighlightCard 
                        title='Entradas'
                        amount={highlightData.entries?.amount}
                        lastTransaction={'Última entrada em ' + highlightData.entries?.lastTransaction}
                        type='up'
                    />
                    <HighlightCard 
                        title='Saídas'
                        amount={highlightData.expensives?.amount}
                        lastTransaction={'Última saída em ' + highlightData.expensives?.lastTransaction}
                        type='down'
                    />
                    <HighlightCard 
                        title='Total'
                        amount={highlightData.total?.amount}
                        lastTransaction={highlightData.total?.lastTransaction}
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