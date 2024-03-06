package simulation;

import java.util.LinkedList;
import java.io.PrintWriter;


public class Contract {
    
    // this is a representation of a ERC20 smart contract
    private LinkedList<Wallet> wallets;
    private double value;
    private boolean rebase;
    

    Contract(){
        this.wallets = new LinkedList<Wallet>();
        this.value = 1.0;
        this.rebase = false;
    }
    
    public void rebase(){
        rebase = true;
        PrintWriter out = Simulation.getWriter();
        out.println("Rebase");
        out.println("Old token amount: " + getNumberofToken()); 
        double newTokenAmount = getNumberofToken()*value;
        out.println();
        for(Wallet wallet : wallets){
            out.println("Wallet: "+wallet.getName() + ", old token amount: " + wallet.getToken() + ", percentage: " + wallet.getPercentage());
            wallet.setToken(newTokenAmount*wallet.getPercentage());
            out.println("Wallet: "+wallet.getName() + ", new token amount: " + wallet.getToken() + ", percentage: " + wallet.getPercentage());
            out.println();
        }
        rebase = false;
        
        out.println("Rebase finished, token amount: " + getNumberofToken());
        out.println();
    }
    
    public void tranfer(Wallet fromWallet, Wallet toWallet, double tokenAmount){
        if(!rebase){
            if(fromWallet.getToken() >= tokenAmount){
                fromWallet.setToken(fromWallet.getToken() - tokenAmount);
                toWallet.setToken(toWallet.getToken() + tokenAmount);
            }
            else{
                Simulation.getWriter().println("Transaction between "+ fromWallet.getName() + " and "+ toWallet.getName() + " not allowed, not enough tokens");
            }
        }
        else{
            Simulation.getWriter().println("Rebase in progress, transaction not allowed");
        }
    }

    public void initPercentages(){
        for(Wallet wallet : wallets){
            wallet.initPercentage();
        }
    }

    //////////////////////////////////////////GETTERS AND SETTERS//////////////////////////////////////////

    public void addWallet(Wallet wallet){
        wallets.add(wallet);
    }

    public LinkedList<Wallet> getWallets(){
        return wallets;
    }

    public double getValue(){
        return value;
    }

    public void setValue(double value){
        this.value = value;
    }

    public double getNumberofToken(){
        double tokenAmount = 0;
        for(Wallet wallet : wallets){
            tokenAmount += wallet.getToken();
        }
        return tokenAmount;
    }

    public boolean isRebase(){
        return rebase;
    }
}
