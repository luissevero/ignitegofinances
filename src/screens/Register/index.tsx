import React, {useState} from 'react'
import { Button } from '../../components/Form/Button'
import { Input } from '../../components/Form/Input'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import {
    Container,
    Header,
    Title, 
    Form,
    Fields,
    TransactionTypes
} from './styles'

export function Register(){

    const [transactionType, setTransactionType] = useState('')

    function handleTransactionsTypeSelect(type: 'up' | 'down'){
        setTransactionType(type)
    }

    return (
        <Container>
            <Header>
                <Title>
                    Cadastro
                </Title>
            </Header>

            <Form>
                <Fields>
                    <Input
                        placeholder='Nome'
                    />

                    <Input
                        placeholder='Preço'
                    />
                    <TransactionTypes>
                        <TransactionTypeButton 
                            type='up'
                            title='Income'
                            onPress={() => handleTransactionsTypeSelect('up')}
                            isActive={transactionType === 'up' ? true : false}
                        />
                        <TransactionTypeButton 
                            type='down'
                            title='Outcome'
                            onPress={() => handleTransactionsTypeSelect('down')}
                            isActive={transactionType === 'down' ? true : false}
                        />
                    </TransactionTypes>
                </Fields>
                <Button title="Enviar"/>
            </Form>

        </Container>
    )
}